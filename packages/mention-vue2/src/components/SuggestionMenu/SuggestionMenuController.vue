<template>
    <div v-if="showDom" ref="floatingRef" :style="style">
        <SuggestionMenuWrapper :query="state.query" :getItems="getItems" :onItemClick="onItemClick"
            :closeMenu="closeMenu" :clearQuery="clearQuery" :insertMention="insertMention" />
    </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue-demi'
import SuggestionMenuWrapper from './SuggestionMenuWrapper.vue'
import { useUIElementPositioning } from '@/hooks/useUIElementPositioning'
import { offset, flip, shift, size } from '@floating-ui/dom'

export default {
    name: 'SuggestionMenuController',
    components: {
        SuggestionMenuWrapper,
    },
    props: {
        triggerCharacter: { type: String, required: true },
        minQueryLength: { type: Number },
        getItems: { type: Function, required: true },
        onItemClick: { type: Function },
    },

    setup(props) {
        const editor = inject('editor')
        const state = ref(null)

        const showDom = computed(() => {
            const res = state.value?.show &&
                (!props.minQueryLength ||
                    state.value.ignoreQueryLength ||
                    (!state.value.query.startsWith(' ') &&
                        state.value.query.length >= props.minQueryLength))
            return res ?? false
        })

        const { floatingRef, style } = useUIElementPositioning(
            () => showDom.value,
            () => state.value?.referencePos || null,
            2000,
            {
                placement: 'bottom-start',
                middleware: [
                    offset(10),
                    flip({ mainAxis: true, crossAxis: false }),
                    shift(),
                    size({
                        apply({ availableHeight, elements }) {
                            Object.assign(elements.floating.style, {
                                maxHeight: `${availableHeight - 10}px`,
                            })
                        },
                    }),
                ],
                onDismiss() {
                    // 可以触发关闭逻辑
                },
            }
        )
       
        let unsubscribe = null
        onMounted(() => {
            unsubscribe = editor.value.suggestionMenus.onUpdate(
                props.triggerCharacter,
                (newState) => {
                    
                    state.value = newState
                }
            )
        })

        onBeforeUnmount(() => {
            unsubscribe && unsubscribe()
        })

        const closeMenu = () => {
            editor.value.suggestionMenus.closeMenu()
        }
        const clearQuery = () => {
            editor.value.suggestionMenus.clearQuery()
        }
        const insertMention = (item) => {
            editor.value.suggestionMenus.insertMention(item)
        }

        return {
            state,
            floatingRef,
            style,
            showDom,
            closeMenu,
            clearQuery,
            insertMention,
        }
    },
}
</script>

<style scoped></style>
