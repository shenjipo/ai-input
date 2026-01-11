

import { ref, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import MEditor from '@shenjipo/mention-editor'

export function useSuggestionMenuKeyboardNavigation<Item>(
    editor: MEditor,
    query: string,
    items: Ref<Array<Item>>,
    onItemClick?: (item: Item) => void
) {
    const selectedIndex = ref<number>(0)

    const handleMenuNavigationKeys = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault()
            if (items.value.length) {
                selectedIndex.value = (selectedIndex.value - 1 + items.value.length) % items.value.length
            }
            return true
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (items.value.length) {
                selectedIndex.value = (selectedIndex.value + 1) % items.value.length
            }
         
            return true
        }

        if (event.key === 'Enter' && !event.isComposing) {
            event.preventDefault()

            if (items.value.length) {
                onItemClick?.(items.value[selectedIndex.value])
            }

            return true
        }

        return false
    }

    onMounted(() => {
      
        editor.domElement.addEventListener(
            'keydown',
            handleMenuNavigationKeys,
            true
        )
    })

    onBeforeUnmount(() => {
        editor.domElement.removeEventListener(
            'keydown',
            handleMenuNavigationKeys,
            true
        )
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
