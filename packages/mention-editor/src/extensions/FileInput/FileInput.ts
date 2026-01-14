import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import { FileInputOptions } from './types'

export const FileInputExtension = Extension.create<FileInputOptions>({
    name: 'imageInput',

    addOptions() {
        return {
            onFileInput: undefined,
        }
    },

    addProseMirrorPlugins() {
        const handleFile = async (file: File) => {
            this.options.onFileInput?.(file)
        }

        return [
            new Plugin({
                props: {
                    handlePaste: (_, event) => {
                        const items = event.clipboardData?.items
                        if (!items) return false

                        for (const item of items) {
                            if (item.kind !== 'file') continue
                            const file = item.getAsFile()
                            if (!file) continue

                            handleFile(file)
                            return true
                        }

                        return false
                    },

                    handleDrop: (_, event) => {
                        const files = event.dataTransfer?.files
                        if (!files || files.length === 0) return false

                        handleFile(files[0])
                        return true
                    },
                },
            }),
        ]
    },
})
