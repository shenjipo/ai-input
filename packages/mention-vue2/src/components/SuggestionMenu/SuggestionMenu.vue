<template>
    <div class="bn-suggestion-menu">
        <template v-if="items.length">
            <div v-for="(item, index) in items" :key="item.id" :class="{ active: index === selectedIndex }"
                class="suggestion-menu-item" @mousedown.prevent="handleItemClick(item)">
                {{ item.label }}
            </div>
        </template>

        <div v-else class="suggestion-menu-item disabled">无数据</div>
    </div>
</template>

<script>
export default {
    name: 'SuggestionMenu',
    props: {
        items: { type: Array, required: true },
        loadingState: { type: String, default: 'idle' },
        selectedIndex: { type: Number, default: 0 },
    },
    methods: {
        handleItemClick(item) {
            this.$emit('itemClick', item)
        },
    },
}
</script>

<style scoped lang="scss">

</style>
