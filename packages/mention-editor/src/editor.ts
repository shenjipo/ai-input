import { Editor, Extension } from '@tiptap/core'
import { baseExtensions } from './schema/base'
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import { ImageInputPayload } from './extensions/ImageInput/types'
import { ImageInputExtension } from './extensions/ImageInput/ImageInput'
import { Transaction } from 'prosemirror-state'
import { SuggestionMenuProseMirrorPlugin } from './extensions/SuggestionMenu/SuggestionPlugin'
import { MentionBlock } from './blocks/MentionBlock'
import { type MentionItem } from './extensions/SuggestionMenu/types'

export interface MentionEditorOptions {
    element: HTMLElement
    onChange: (text: string) => void
    placeholder?: string
    onImageInput?: (payload: ImageInputPayload) => void
    onFileReject?: (file: File) => void
}


export default class MEditor {
    _tiptapEditor: Editor
    public readonly suggestionMenus: SuggestionMenuProseMirrorPlugin

    constructor(options: MentionEditorOptions) {
        this.suggestionMenus = new SuggestionMenuProseMirrorPlugin(this)
        const MEditorUIExtension = Extension.create({
            name: 'MEditorUIExtension',
            addProseMirrorPlugins: () => {
                return [
                    this.suggestionMenus.plugin,
                ]
            },
        })

        this._tiptapEditor = new Editor({
            element: options.element,
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
                ImageInputExtension.configure({
                    onImageInput: options.onImageInput,
                    onFileReject: options.onFileReject,
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
        this._tiptapEditor
            .chain()
            .focus()
            .insertContent({
                type: 'mention',
                attrs: item
            })
            .insertContent(' ')
            .run()
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
}
