<template>
    <SuggestionMenu :items="items" :loading-state="loadingState" :selected-index="selectedIndex"
        @itemClick="onItemClickInternal" />
</template>

<script>
import { ref, watch, onMounted, inject } from 'vue-demi'
import SuggestionMenu from './SuggestionMenu.vue'
import { useSuggestionMenuKeyboardNavigation } from '@/hooks/useSuggestionMenuKeyboardNavigation'
import { useCloseSuggestionMenuNoItems } from '@/hooks/useCloseSuggestionMenuNoItems'

export default {
    name: 'SuggestionMenuWrapper',
    components: {
        SuggestionMenu,
    },
    props: {
        query: { type: String, required: true },
        getItems: { type: Function, required: true },
        onItemClick: { type: Function },
        closeMenu: { type: Function, required: true },
        clearQuery: { type: Function, required: true },
        insertMention: { type: Function, required: true },
    },
    setup(props) {
        const items = ref([])
        const loadingState = ref('idle')
        const usedQuery = ref('')
        const editor = inject('editor')

        const onItemClickInternal = (item) => {
            props.closeMenu()
            props.clearQuery()
            props.insertMention(item)
        }

        const selectedIndex = useSuggestionMenuKeyboardNavigation(
            editor.value,
            props.query,
            items,
            onItemClickInternal
        )
        useCloseSuggestionMenuNoItems(items, usedQuery, props.closeMenu)

        const loadItems = () => {
            const currentQuery = props.query
            usedQuery.value = props.query
            loadingState.value = 'loading'

            props.getItems(props.query).then((newItems) => {
                if (usedQuery.value !== currentQuery) return
                items.value = newItems
                loadingState.value = 'loaded'
            })
        }

        onMounted(loadItems)

        watch(
            () => props.query,
            () => {
                loadItems()
            }
        )

        return {
            items,
            loadingState,
            selectedIndex,
            onItemClickInternal,
        }
    },
}
</script>

<style scoped></style>
