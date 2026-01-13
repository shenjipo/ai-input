<template>
    <div v-if="showDom" ref="floatingRef" :style="style">
        <SuggestionMenuWrapper :query="state!.query" :getItems="getItems" :onItemClick="onItemClick"
            :closeMenu="closeMenu" :clearQuery="clearQuery" :insertMention="insertMention" />
    </div>
</template>

<script setup lang="ts">
import SuggestionMenuWrapper from './SuggestionMenuWrapper.vue';
import { ref, computed, onUnmounted, onMounted, inject, Ref } from 'vue';
import type { SuggestionMenuState } from '@shenjipo/mention-editor';
import MEditor from '@shenjipo/mention-editor';
import type { SuggestionItem } from './types';
import { useUIElementPositioning } from '@/hooks/useUIElementPositioning';
import { flip, offset, shift, size } from '@floating-ui/vue'

const props = defineProps<{
    triggerCharacter: string,
    minQueryLength?: number,
    getItems: (query: string) => Promise<SuggestionItem[]>,
    onItemClick?: (item: SuggestionItem) => void
}>()

const state = ref<SuggestionMenuState | null>(null)
const editor = inject<Ref<MEditor>>('editor')
const showDom = computed(() => {
    const res = state.value?.show &&
        (!props.minQueryLength ||
            state.value.ignoreQueryLength ||
            (!state.value.query.startsWith(' ') &&
                state.value.query.length >= props.minQueryLength))

    return res === undefined ? false : res
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

        },
    }
)


let unsubscribe: any = null

onMounted(() => {

    unsubscribe = editor?.value.suggestionMenus.onUpdate(
        props.triggerCharacter,
        (newState) => {
            state.value = newState

        }
    )
})

onUnmounted(() => {
    unsubscribe?.()
})

const closeMenu = () => {
    editor!.value.suggestionMenus.closeMenu()
}

const clearQuery = () => {
    editor!.value.suggestionMenus.clearQuery()
}
const emit = defineEmits(['itemClick'])
const insertMention = (item: any) => {
    editor!.value.inserMentionBlock(item)
    // editor!.value.suggestionMenus.insertMention(item)
    emit('itemClick', item)
}
</script>

<style scoped></style>
