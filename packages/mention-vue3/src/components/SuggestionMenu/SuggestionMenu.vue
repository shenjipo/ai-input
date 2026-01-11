<template>
    <div class="bn-suggestion-menu">

        <div v-if="items.length" class="suggestion-menu-item" v-for="(item, index) in items" :key="item.id"
            :class="{ active: index === selectedIndex }" @mousedown.prevent="handleItemClick(item)">
            {{ item.label }}
        </div>
        <div class="suggestion-menu-item disabled" v-else>无数据</div>

    </div>

</template>

<script setup lang="ts">
import { type SuggestionItem } from './types';

const props = defineProps<{
    items: Array<SuggestionItem>,
    loadingState: 'idle' | 'loading' | 'loaded',
    selectedIndex: number
}>()


const emit = defineEmits()
const handleItemClick = (item: SuggestionItem) => {
    emit('itemClick', item)
}
</script>

<style lang="scss" scoped>

</style>
