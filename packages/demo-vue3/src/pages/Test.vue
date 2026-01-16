<template>
    <MEditorVue3 class="editor" ref="mEditorVue3Ref" v-model="inputValue" @file-reject="handleFielRejcet"
        @image-input="handleImagePaste">

        <template #header>
            <div class="mention-header">
                <el-image v-for="image in files" :src="image.url" fit="cover" :preview-src-list="[image.url]">
                </el-image>
            </div>
        </template>

        <SlashMention />
        <AtMention />

        <template #footer>
            <el-button type="primary" @click="handleClick">打印内容</el-button>
            <el-button type="primary" @click="handleInsert">插入mention</el-button>
            <el-button type="primary" @click="handleDelete">清空内容</el-button>
        </template>
    </MEditorVue3>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SlashMention from '@/components/SlashMention.vue';
import AtMention from '@/components/AtMention.vue';
import MEditorVue3 from '@shenjipo/mention-vue3';
import { type ImageInputPayload } from '@shenjipo/mention-editor';
import "@shenjipo/mention-vue3/dist/index.css"
import { ElMessage } from 'element-plus';

const inputValue = ref('123fds')
const mEditorVue3Ref = ref<Nullable<InstanceType<typeof MEditorVue3>>>(null)

const files = ref<Array<{
    file: File,
    url: string
}>>([])

const handleClick = () => {
    console.log(inputValue.value)
}

const handleInsert = () => {
    mEditorVue3Ref.value!.editor.inserMentionBlock({
        id: '123',
        label: '你好'
    })
}

const handleDelete = () => {
    mEditorVue3Ref.value?.clear()
}

const handleFielRejcet = (file: File) => {
    ElMessage.error(`暂不持支持 ${file.name} 的文件格式!`)
}

const handleImagePaste = (val: ImageInputPayload) => {
    files.value.push({
        file: val.file,
        url: val.base64,
    })
}
</script>

<style scoped>
.editor {
    .mention-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .el-image {
            width: 52px;
            height: 52px;
        }

        .el-image:not(:first-child) {
            margin-left: 16px;
        }
    }
}
</style>
