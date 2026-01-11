import { ref, computed, watch, nextTick } from 'vue-demi'
import { computePosition, autoUpdate, offset, flip, shift } from '@floating-ui/dom'

export function useUIElementPositioning(show, referencePos, zIndex, options = {}) {
    const reference = ref(null)
    const floatingRef = ref(null)
    const floatingStyles = ref({})
    let cleanupAutoUpdate = null

    watch(
        referencePos,
        (pos) => {
            if (!pos) return
            reference.value = {
                getBoundingClientRect: () => pos,
            }
            updatePosition()
        },
        { immediate: true }
    )

    watch(
        show,
        async (visible) => {
            if (!visible) {
                stopAutoUpdate()
                return
            }
            await nextTick()
            if (!reference.value || !floatingRef.value) return
            updatePosition()
            startAutoUpdate()
        }
    )


    const updatePosition = () => {

        const refEl = reference.value
        const floatEl = floatingRef.value
        if (!refEl || !floatEl) return

        // computePosition 支持虚拟元素
        computePosition(refEl, floatEl, {
            placement: options.placement || 'bottom-start',
            middleware: [
                offset(options.offset || 8),
                flip(),
                shift({ padding: 8 }),
            ],
        }).then(({ x, y }) => {
            floatingStyles.value = {
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
            }
        })
    }

    function startAutoUpdate() {
        if (!reference.value || !floatingRef.value) return
        cleanupAutoUpdate = autoUpdate(reference.value, floatingRef.value, updatePosition)
    }

    function stopAutoUpdate() {
        if (cleanupAutoUpdate) {
            cleanupAutoUpdate()
            cleanupAutoUpdate = null
        }
    }

    const style = computed(() => ({
        display: 'flex',
        zIndex,
        ...floatingStyles.value,
    }))

    return {
        floatingRef: floatingRef,
        style,
    }
}
