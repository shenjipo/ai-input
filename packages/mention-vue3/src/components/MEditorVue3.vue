<template>
    <div class="mention-editor-wrapper">
        <slot name="header"></slot>
        <div ref="editorRef" class="mention-editor">
            <slot v-if="editor"></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script setup lang="ts">
import MEditor from '@shenjipo/mention-editor';
import { ref, onMounted, provide, shallowRef } from 'vue';
import { SuggestionItem } from './SuggestionMenu/types';

const props = withDefaults(defineProps<
    {
        modelValue: string,
        options?: Partial<{
            placeholder: string
        }>
    }

>(), {
    options: () => {
        return {
            placeholder: '请输入内容，可粘贴图片到此处，按下/唤起快捷指令，'
        }
    }
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'fileInput', file: File): void
    (e: 'deleteMention', item: SuggestionItem): void
}>()


const editor = shallowRef<MEditor>()

provide('editor', editor)

const editorRef = ref<HTMLElement | null>(null)

onMounted(() => {
    if (editorRef.value) {
        editor.value = new MEditor({
            element: editorRef.value,
            placeholder: props.options.placeholder,
            onChange: (val: string) => {
                // 监听编辑器内容变化，触发 v-model 更新
                emit('update:modelValue', val)
            },
            onFileInput: (file) => {
                emit('fileInput', file)
            },
            onMentionDelete(item) {
                emit('deleteMention', item)
            },
        })
    }
})

const clear = () => {
    editor.value.clear()
    emit('update:modelValue', '')
}

defineExpose({
    editor,
    clear,
})
</script>

<style scoped></style>
