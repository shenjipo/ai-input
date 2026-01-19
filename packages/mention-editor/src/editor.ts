import { Editor, Extension } from '@tiptap/core'
import { baseExtensions } from './schema/base'
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import { FileInputExtension } from './extensions/FileInput/FileInput'
import { Transaction } from 'prosemirror-state'
import { SuggestionMenuProseMirrorPlugin } from './extensions/SuggestionMenu/SuggestionPlugin'
import { MentionBlock } from './blocks/MentionBlock'
import { type MentionItem } from './extensions/SuggestionMenu/types'
import { InsertMentionBlock } from './api/InsertMentionBlock'
import { MentionDeletePlugin } from './extensions/MentionDeletePlugin/MentionDeletePlugin'
import { ShiftEnterPlugin } from './extensions/ShiftEnterPlugin/ShiftEnterPlugin'

export interface MentionEditorOptions {
    element: HTMLElement
    onChange: (text: string) => void
    placeholder?: string
    onFileInput?: (file: File) => void
    content?: string
    onMentionDelete?: (item: MentionItem) => void
    onEnter?: () => void
    lineBreak?: 'shift-enter' | 'enter'
}


export default class MEditor {
    _tiptapEditor: Editor
    public readonly suggestionMenus: SuggestionMenuProseMirrorPlugin
    public readonly mentionDeletePlugin: MentionDeletePlugin
    public readonly shiftEnterPlugin: ShiftEnterPlugin

    constructor(options: MentionEditorOptions) {
        this.suggestionMenus = new SuggestionMenuProseMirrorPlugin(this)
        this.mentionDeletePlugin = new MentionDeletePlugin(this, options.onMentionDelete)

        if (options.lineBreak === 'shift-enter') {
            this.shiftEnterPlugin = new ShiftEnterPlugin(this, options.onEnter)
        }

        const MEditorUIExtension = Extension.create({
            name: 'MEditorUIExtension',
            addProseMirrorPlugins: () => {
                const plugins = [
                    this.suggestionMenus.plugin,
                    this.mentionDeletePlugin.plugin
                ]

                if (this.shiftEnterPlugin) {
                    plugins.unshift(this.shiftEnterPlugin.plugin)
                }
                return plugins
            },
        })

        this._tiptapEditor = new Editor({
            element: options.element,
            content: options.content || '',
            extensions: [
                ...baseExtensions,
                History.configure({
                    depth: 100,
                    newGroupDelay: 500,
                }),
                MentionBlock,
                Placeholder.configure({
                    placeholder: options.placeholder || '请输入...',
                    emptyEditorClass: 'is-editor-empty'
                }),
                FileInputExtension.configure({
                    onFileInput: options.onFileInput,
                }),
                MEditorUIExtension,
            ],
            onUpdate: ({ editor }) => {
                options.onChange(editor.getText())
            }
        })
    }


    dispatch(tr: Transaction) {
        this._tiptapEditor.view.dispatch(tr)
    }

    public inserMentionBlock(item: MentionItem) {
        InsertMentionBlock(this, item)
        // this._tiptapEditor
        //     .chain()
        //     .focus()
        //     .insertContent({
        //         type: 'mention',
        //         attrs: item
        //     })
        //     .insertContent(' ')
        //     .run()
    }

    public get isEditable(): boolean {
        return this._tiptapEditor.isEditable === undefined ? true : this._tiptapEditor.isEditable
    }

    public get domElement() {
        return this._tiptapEditor.view.dom as HTMLDivElement
    }

    public clear() {
        this._tiptapEditor.commands.clearContent(true)
        this._tiptapEditor.commands.focus()
    }

    public getAllMentionBlocks(): Array<MentionItem> {
        const mentions: Array<MentionItem> = []

        const doc = this._tiptapEditor.state.doc

        doc.descendants((node, pos) => {
            if (node.type.name === 'mention') {
                mentions.push({
                    id: node.attrs.id ?? null,
                    label: node.attrs.label ?? null,
                })
            }
        })

        return mentions
    }
}
