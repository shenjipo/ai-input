export interface ImageInputPayload {
    file: File
    base64: string
    width?: number
    height?: number
}

export interface ImageInputOptions {
    onImageInput?: (payload: ImageInputPayload) => void
    onFileReject?: (file: File) => void
}