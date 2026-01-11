<template>
    <SuggestionMenu :items="items" :loading-state="loadingState" :selected-index="selectedIndex"
        @itemClick="onItemClickInternal" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject, type Ref } from 'vue';
import { useSuggestionMenuKeyboardNavigation } from '@/hooks/useSuggestionMenuKeyboardNavigation';
import SuggestionMenu from './SuggestionMenu.vue';
import { type SuggestionItem } from './types';
import MEditor from '@shenjipo/mention-editor';
import { useCloseSuggestionMenuNoItems } from '@/hooks/useCloseSuggestionMenuNoItems';

const props = defineProps<{
    query: string,
    getItems: (query: string) => Promise<SuggestionItem[]>
    onItemClick?: (item: SuggestionItem) => void
    closeMenu: () => void
    clearQuery: () => void
    insertMention: (item: any) => void
}>()

const items = ref<Array<SuggestionItem>>([])
const loadingState = ref('idle')
const usedQuery = ref('')
const editor = inject<Ref<MEditor>>('editor')

const onItemClickInternal = (item: SuggestionItem) => {
    props.closeMenu()
    props.clearQuery()
    props.insertMention(item)
}

const selectedIndex = useSuggestionMenuKeyboardNavigation<SuggestionItem>(editor!.value, props.query, items, onItemClickInternal)
useCloseSuggestionMenuNoItems(items, usedQuery, props.closeMenu)

onMounted(() => {
    loadItems()
})

const loadItems = () => {
    const thisQuery = props.query
    usedQuery.value = props.query

    loadingState.value = 'loading'
    props.getItems(props.query).then(newItems => {
        if (usedQuery.value !== thisQuery) {
            return
        }
        items.value = newItems
        loadingState.value = 'loaded'
    })

}

watch(() => {
    return props.query
}, () => {
    loadItems()
})


</script>

<style scoped></style>
