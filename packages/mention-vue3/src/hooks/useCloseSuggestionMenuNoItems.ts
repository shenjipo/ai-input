import { ref, watch, type Ref } from 'vue'

export function useCloseSuggestionMenuNoItems<Item>(
    items: Ref<Array<Item>>,
    usedQuery: Ref<string>,
    closeMenu: () => void,
    invalidQueries = 8,
) {
    // 等价 useRef
    const lastUsefulQueryLength = ref(0)
    watch(
        [items, usedQuery],
        ([newItems, newQuery]) => {
            if (newQuery === undefined) {
                return
            }
            if (newItems.length > 0) {
                lastUsefulQueryLength.value = newQuery.length
            } else if (newQuery.length - lastUsefulQueryLength.value > invalidQueries) {
                closeMenu()
            }
        },

    )
}
