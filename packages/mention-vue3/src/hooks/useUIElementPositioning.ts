
import { useFloating, autoUpdate, type UseFloatingOptions, } from '@floating-ui/vue'
import { ref, computed, watch, onUnmounted } from 'vue'

type VirtualReference = {
    getBoundingClientRect: () => DOMRect
}

export function useUIElementPositioning(
    show: () => boolean,
    referencePos: () => DOMRect | null,
    zIndex: number,
    options?: UseFloatingOptions & {
        onDismiss?: () => void
    }) {
   

    const reference = ref<VirtualReference | null>(null)
    const floating = ref<HTMLElement | null>(null)

    const { floatingStyles, update } = useFloating(
        reference,
        floating,
        {
            ...options,
            whileElementsMounted: autoUpdate,
        }
    )

    watch(
        referencePos,
        (pos) => {
            if (!pos) return
            reference.value = {
                getBoundingClientRect: () => pos,
            }
            update()
        },
        { immediate: true }
    )

    const style = computed(() => ({
        display: 'flex',
        zIndex,
        ...floatingStyles.value,
    }))

    return {
        floatingRef: floating,
        style,
    }
}
