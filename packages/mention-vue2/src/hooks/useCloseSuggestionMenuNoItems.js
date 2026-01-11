import { ref, watch } from 'vue-demi'

export function useCloseSuggestionMenuNoItems(
    items,
    usedQuery,
    closeMenu,
    invalidQueries = 8,
) {
    // 上一次“有效查询”的长度
    const lastUsefulQueryLength = ref(0)

    watch(
        [items, usedQuery],
        ([newItems, newQuery]) => {
            if (newQuery == null) {
                return
            }

            if (newItems && newItems.length > 0) {
                lastUsefulQueryLength.value = newQuery.length
            } else if (
                newQuery.length - lastUsefulQueryLength.value > invalidQueries
            ) {
                closeMenu()
            }
        }
    )

    return {
        lastUsefulQueryLength,
    }
}
