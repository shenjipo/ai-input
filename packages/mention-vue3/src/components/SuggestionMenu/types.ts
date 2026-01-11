export type SuggestionMenuProps<T> = {
    items: T[]
    loadingState: 'loading-initial' | 'loading' | 'loaded'
    selectedIndex: number | undefined
    onItemClick?: (item: T) => void
}

export interface SuggestionItem {
    id: string
    label: string
}