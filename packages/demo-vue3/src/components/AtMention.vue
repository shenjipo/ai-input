<template>
    <SuggestionMenuController :triggerCharacter="'@'" :getItems="getItems" :onItemClick="handleClickItem" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SuggestionMenuController, type SuggestionItem } from '@shenjipo/mention-vue3';
const suggestions = ref<Array<SuggestionItem>>([
    { id: '1', label: '帮我写作' },
    { id: '2', label: '编程' },
    { id: '3', label: '图像生成' },
    { id: '4', label: '解题答疑' },
    { id: '5', label: '音乐生成' },
    { id: '6', label: '数据分析' },
])

const getItems = (query: string) => {
    const items = suggestions.value.filter(item => {
        return item.label.includes(query)
    })

    return Promise.resolve(items)
}

const handleClickItem = (item: SuggestionItem) => {
    
}
</script>

<style scoped></style>
