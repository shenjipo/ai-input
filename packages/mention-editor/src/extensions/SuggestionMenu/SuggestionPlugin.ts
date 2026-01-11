import { findParentNode } from '@tiptap/core'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import MEditor from '../../editor'
import { EventEmitter } from '../../utils/EventEmitter'
import { SuggestionMenuState, MentionItem } from './types'

type SuggestionPluginState =
    | {
        triggerCharacter: string
        deleteTriggerCharacter: boolean
        queryStartPos: number
        query: string
        decorationId: string
        ignoreQueryLength?: boolean
    }
    | undefined

export const suggestionMenuPluginKey = new PluginKey('SuggestionMenuPlugin')
const findBlock = findParentNode(node => node.type.name === 'blockContainer')

class SuggestionMenuView {
    pluginState: SuggestionPluginState
    public state?: SuggestionMenuState
    public emitUpdate: (triggerCharacter: string) => void
    private rootEl?: Document | ShadowRoot

    constructor(
        private readonly editor: MEditor,
        emitUpdate: (menuName: string, state: SuggestionMenuState) => void
    ) {
        this.pluginState = undefined

        this.emitUpdate = (menuName: string) => {
            if (!this.state) {
                throw new Error('Attempting to update uninitialized suggestions menu')
            }
            emitUpdate(menuName, {
                ...this.state,
                ignoreQueryLength: this.pluginState?.ignoreQueryLength,
            })
        }
        setTimeout(() => {
            this.rootEl = this.editor._tiptapEditor.view.root
        })

    }

    update(view: EditorView, prevState: EditorState) {

        const prev: SuggestionPluginState = suggestionMenuPluginKey.getState(prevState)
        const next: SuggestionPluginState = suggestionMenuPluginKey.getState(view.state)

        // See how the state changed
        const started = prev === undefined && next !== undefined
        const stopped = prev !== undefined && next === undefined
        const changed = prev !== undefined && next !== undefined

        // Cancel when suggestion isn't active
        if (!started && !changed && !stopped) {
            return
        }

        this.pluginState = stopped ? prev : next

        if (stopped || !this.editor.isEditable) {

            this.state!.show = false
            this.emitUpdate(this.pluginState!.triggerCharacter)

            return
        }

        const decorationNode = this.rootEl?.querySelector(`[data-decoration-id="${this.pluginState!.decorationId}"]`)

        if (this.editor.isEditable && decorationNode) {

            this.state = {
                show: true,
                referencePos: decorationNode.getBoundingClientRect(),
                query: this.pluginState!.query,
            }

            this.emitUpdate(this.pluginState!.triggerCharacter!)
        }
    }

    destroy() {

    }

    closeMenu = () => {
        this.editor.dispatch(this.editor._tiptapEditor.view.state.tr.setMeta(suggestionMenuPluginKey, null))
    }

    clearQuery = () => {
        if (this.pluginState === undefined) {
            return
        }

        this.editor._tiptapEditor
            .chain()
            .focus()
            .deleteRange({
                from:
                    this.pluginState.queryStartPos! -
                    (this.pluginState.deleteTriggerCharacter ? this.pluginState.triggerCharacter!.length : 0),
                to: this.editor._tiptapEditor.state.selection.from,
            })
            .run()
    }

    insertMention = (item: MentionItem) => {
        this.editor._tiptapEditor
            .chain()
            .focus()
            .insertContent({
                type: 'mention',
                attrs: item
            })
            .insertContent(' ')
            .run()
    }

    getReplaceRange() {
        if (!this.pluginState) return null

        const from = this.pluginState.queryStartPos -
            (this.pluginState.deleteTriggerCharacter ? this.pluginState.triggerCharacter.length : 0)

        const to = this.editor._tiptapEditor.state.selection.from

        return { from, to }
    }

}

export class SuggestionMenuProseMirrorPlugin extends EventEmitter<any> {
    public view: SuggestionMenuView
    public readonly plugin: Plugin
    private triggerCharacters: string[] = []

    constructor(editor: MEditor) {
        super()
        const triggerCharacters = this.triggerCharacters

        this.plugin = new Plugin({
            key: suggestionMenuPluginKey,
            view: () => {
                this.view = new SuggestionMenuView(editor, (triggerCharacter, state) => {
                    this.emit(`update ${triggerCharacter}`, state)
                })
                return this.view
            },
            state: {
                init(): SuggestionPluginState {
                    return undefined
                },
                apply(transaction, prev, _oldState, newState): SuggestionPluginState {
                    const suggestionPluginTransactionMeta: {
                        triggerCharacter: string
                        deleteTriggerCharacter?: boolean
                        ignoreQueryLength?: boolean
                    } | null = transaction.getMeta(suggestionMenuPluginKey)


                    if (
                        typeof suggestionPluginTransactionMeta === 'object' &&
                        suggestionPluginTransactionMeta !== null &&
                        prev === undefined
                    ) {
                        return {
                            triggerCharacter: suggestionPluginTransactionMeta.triggerCharacter,
                            deleteTriggerCharacter: suggestionPluginTransactionMeta.deleteTriggerCharacter !== false,
                            queryStartPos: transaction.selection?.from || newState.selection.from,
                            query: '',
                            decorationId: `id_${Math.floor(Math.random() * 0xffffffff)}`,
                            ignoreQueryLength: suggestionPluginTransactionMeta?.ignoreQueryLength,
                        }
                    }


                    if (prev === undefined) {
                        return prev
                    }


                    if (
                        newState.selection.from !== newState.selection.to ||
                        suggestionPluginTransactionMeta === null ||
                        transaction.getMeta('focus') ||
                        transaction.getMeta('blur') ||
                        transaction.getMeta('pointer') ||
                        (prev.triggerCharacter !== undefined && newState.selection.from < prev.queryStartPos!)
                    ) {

                        return undefined
                    }

                    const next = { ...prev }


                    next.query = newState.doc.textBetween(prev.queryStartPos!, newState.selection.from)

                    return next
                }
            },

            props: {
                // 当用户输入一个 trigger 字符，且当前没有 suggestion 激活时：
                // 插件拦截这次输入，自己插入字符，并通过 transaction meta 通知 state 打开 suggestion 菜单；
                // 其余情况下，完全不干预编辑器行为。
                handleTextInput(view, _from, _to, text) {

                    const suggestionPluginState: SuggestionPluginState = (this as Plugin).getState(view.state)

                    if (triggerCharacters.includes(text) && suggestionPluginState === undefined) {
                        view.dispatch(
                            view.state.tr.insertText(text).scrollIntoView().setMeta(suggestionMenuPluginKey, {
                                triggerCharacter: text,
                            })
                        )

                        return true
                    }
                    return false
                },

                // Setup decorator on the currently active suggestion.
                decorations(state) {
                    const suggestionPluginState: SuggestionPluginState = (this as Plugin).getState(state)

                    if (suggestionPluginState === undefined) {
                        return null
                    }

                    // If the menu was opened programmatically by another extension, it may not use a trigger character. In this
                    // case, the decoration is set on the whole block instead, as the decoration range would otherwise be empty.
                    if (!suggestionPluginState.deleteTriggerCharacter) {
                        const blockNode = findBlock(state.selection)
                        if (blockNode) {
                            return DecorationSet.create(state.doc, [
                                Decoration.node(blockNode.pos, blockNode.pos + blockNode.node.nodeSize, {
                                    nodeName: 'span',
                                    class: 'bn-suggestion-decorator',
                                    'data-decoration-id': suggestionPluginState.decorationId,
                                }),
                            ])
                        }
                    }
                    // Creates an inline decoration around the trigger character.
                    return DecorationSet.create(state.doc, [
                        Decoration.inline(
                            suggestionPluginState.queryStartPos! - suggestionPluginState.triggerCharacter!.length,
                            suggestionPluginState.queryStartPos!,
                            {
                                nodeName: 'span',
                                class: 'bn-suggestion-decorator',
                                'data-decoration-id': suggestionPluginState.decorationId,
                            }
                        ),
                    ])
                },
            }
        })
    }

    public onUpdate(triggerCharacter: string, callback: (state: SuggestionMenuState) => void) {
        if (!this.triggerCharacters.includes(triggerCharacter)) {
            this.addTriggerCharacter(triggerCharacter)
        }
        // TODO: be able to remove the triggerCharacter
        return this.on(`update ${triggerCharacter}`, callback)
    }

    addTriggerCharacter = (triggerCharacter: string) => {
        this.triggerCharacters.push(triggerCharacter)
    }

    // TODO: Should this be called automatically when listeners are removed?
    removeTriggerCharacter = (triggerCharacter: string) => {
        this.triggerCharacters = this.triggerCharacters.filter(c => c !== triggerCharacter)
    }

    closeMenu = () => this.view!.closeMenu()

    clearQuery = () => this.view!.clearQuery()

    insertMention = (item: MentionItem) => this.view!.insertMention(item)

    public get shown() {
        return this.view?.state?.show || false
    }

}
