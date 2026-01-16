<template>
    <div class="mention-editor-wrapper">
        <slot name="header"></slot>
        <div ref="editorRef" class="mention-editor">
            <slot v-if="editor"></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script>
import MEditor from '@shenjipo/mention-editor'
import { ref, onMounted, provide } from 'vue-demi'

export default {
    name: 'MEditorVue2',
    props: {
        value: { type: String, default: '' },
        options: {
            type: Object,
            default: () => ({
                placeholder: '请输入内容，可粘贴图片到此处，按下/唤起快捷指令，',
            }),
        },
    },
    emits: ['input', 'fileReject', 'imageInput', 'deleteMention'],
    setup(props, { emit, expose }) {
        const editor = ref(null)
        const editorRef = ref(null)

        provide('editor', editor)

        onMounted(() => {
            if (editorRef.value) {
                editor.value = new MEditor({
                    element: editorRef.value,
                    content: props.value,
                    placeholder: props.options.placeholder,
                    onChange: (val) => {
                        emit('input', val)
                    },
                    onFileInput: (payload) => {
                        emit('fileInput', payload)
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

        expose({ editor, clear })

        return {
            editor,
            editorRef,
            clear,
        }
    },
}
</script>

<style scoped></style>
