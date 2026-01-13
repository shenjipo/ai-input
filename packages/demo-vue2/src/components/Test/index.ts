import { Component, Vue } from "vue-property-decorator"
import MEditorVue2 from "@shenjipo/mention-vue2"
import "@shenjipo/mention-vue2/dist/index.css"
import { Message } from "element-ui"
import SlashMention from "../SlashMention/index.vue"
import type { MEditorVue2Type } from "@shenjipo/mention-vue2/types"

@Component({
    components: {
        MEditorVue2,
        SlashMention,
    }
})
export default class Test extends Vue {

    inputValue = ''
    placeholder = '发消息或输入 / 选择技能'
    files: Array<{
        file: File,
        url: string
    }> = []
    $refs: {
        editorRef: MEditorVue2Type
    }


    mounted() {
        this.$refs.editorRef.clear()
    }

    created() {

    }

    handleClick() {

    }

    handleInsert() {
        this.$refs.editorRef.editor.inserMentionBlock({
            id: '123',
            label: '你好'
        })
    }

    handleDelete() {
        this.$refs.editorRef.clear()
    }

    handleFileChange(val: { file: File, base64: string }) {

        this.files.push({
            file: val.file,
            url: val.base64,
        })
    }

    handleFileReject(file: File) {

        Message.error(`暂不持支持 ${file.name} 的文件格式!`)
    }
}