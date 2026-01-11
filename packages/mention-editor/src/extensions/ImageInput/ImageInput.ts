import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import {
    isImageFile,
    fileToBase64,
    getImageSize,
} from '../../utils/file'
import { ImageInputPayload, ImageInputOptions } from './types'



export const ImageInputExtension = Extension.create<ImageInputOptions>({
    name: 'imageInput',

    addOptions() {
        return {
            onImageInput: undefined,
            onFileReject: undefined,
        }
    },

    addProseMirrorPlugins() {
        const handleFile = async (file: File) => {
            if (!isImageFile(file)) {
                this.options.onFileReject?.(file)
                return
            }

            const base64 = await fileToBase64(file)
            const size = await getImageSize(base64)

            this.options.onImageInput?.({
                file,
                base64,
                ...size,
            })
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
