export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export function isImageFile(file: File) {
    return file.type.startsWith('image/')
}

export function getImageSize(base64: string): Promise<{ width: number; height: number }> {
    return new Promise(resolve => {
        const img = new Image()
        img.onload = () => resolve({ width: img.width, height: img.height })
        img.src = base64
    })
}