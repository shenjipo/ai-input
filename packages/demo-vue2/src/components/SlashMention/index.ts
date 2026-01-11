import { Component, Vue, Prop } from "vue-property-decorator"
import { SuggestionMenuController } from '@shenjipo/mention-vue2';

interface SuggestionItem {
    label: string
    id: string
}
@Component({
    components: {
        SuggestionMenuController
    }
})
export default class SlashMention extends Vue {

    suggestions: Array<SuggestionItem> = [
        { id: '1', label: '帮我写作' },
        { id: '2', label: '编程' },
        { id: '3', label: '图像生成' },
        { id: '4', label: '解题答疑' },
        { id: '5', label: '音乐生成' },
        { id: '6', label: '数据分析' },
    ]

    getItems(query: string) {
        const items = this.suggestions.filter(item => {
            return item.label.includes(query)
        })
        return Promise.resolve(items)
    }

    handleClickItem(item: SuggestionItem) {

    }
}