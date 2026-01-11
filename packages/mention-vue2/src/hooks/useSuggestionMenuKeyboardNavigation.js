import { ref, watch, onMounted, onBeforeUnmount } from 'vue-demi'

export function useSuggestionMenuKeyboardNavigation(editor, query, items, onItemClick) {
    const selectedIndex = ref(0)

    const handleMenuNavigationKeys = (event) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault()
            if (items.value && items.value.length) {
                selectedIndex.value = (selectedIndex.value - 1 + items.value.length) % items.value.length
            }
            return true
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (items.value && items.value.length) {
                selectedIndex.value = (selectedIndex.value + 1) % items.value.length
            }
            return true
        }

        if (event.key === 'Enter' && !event.isComposing) {
            event.preventDefault()
            if (items.value && items.value.length) {
                onItemClick && onItemClick(items.value[selectedIndex.value])
            }
            return true
        }

        return false
    }

    onMounted(() => {
        if (editor && editor.domElement) {
            editor.domElement.addEventListener('keydown', handleMenuNavigationKeys, true)
        }
    })

    onBeforeUnmount(() => {
        if (editor && editor.domElement) {
            editor.domElement.removeEventListener('keydown', handleMenuNavigationKeys, true)
        }
    })

    // query 变化时重置选中索引
    watch(
        () => query,
        () => {
            selectedIndex.value = 0
        }
    )

    return selectedIndex
}
