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

    inputValue = 'aaaa'
    placeholder = '发消息或输入 / 选择技能'
    files: Array<{
        file: File,
        url: string
    }> = []
    $refs: {
        editorRef: MEditorVue2Type
    }


    mounted() {
        
    }

    created() {

    }

    handleClick() {
        console.log(this.inputValue)
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

    handleFileChange(file: File) {
        console.log('handleFileChange', file)
    }

    handleDeleteMention(item: any) {
        console.log('handleDeleteMention', item)
    }

    handleShowMention() {
        console.log(this.$refs.editorRef.editor.getAllMentionBlocks())
    }
}