export function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    props: Partial<HTMLElementTagNameMap[K]> = {},
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag)
    Object.assign(el, props)
    return el
}
