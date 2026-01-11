import { Node } from '@tiptap/core'

export const MentionBlock = Node.create({
    name: 'mention',
    inline: true,
    group: 'inline',
    atom: true,
    selectable: false,

    addAttributes() {
        return {
            id: { default: null },
            label: { default: null },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="mention"]',
            },
        ]
    },

    renderHTML({ node }) {
        return [
            'span',
            {
                class: 'mention',
                'data-type': 'mention',
                'data-id': node.attrs.id,
                'data-label': node.attrs.label,
                contenteditable: 'false', // 非编辑
            },
            node.attrs.label,
        ]
    },

    // 新增：确保mention节点可以正确序列化/反序列化
    renderText({ node }) {
        return ''
    },
})


