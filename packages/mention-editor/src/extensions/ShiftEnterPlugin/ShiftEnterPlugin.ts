import { Plugin, PluginKey } from 'prosemirror-state'
import MEditor from '../../editor'

export class ShiftEnterPlugin {
    public readonly plugin: Plugin

    constructor(editor: MEditor, onEnter?: () => void) {
        this.plugin = new Plugin({
            key: new PluginKey('shift-enter'),

            props: {
                handleKeyDown(view, event) {
                    // 只处理 Enter
                    if (event.key !== 'Enter') {
                        return false
                    }

                    //  Shift + Enter：插入换行
                    if (event.shiftKey) {
                        event.preventDefault()

                        const { state, dispatch } = view
                        const { hard_break } = state.schema.nodes
            
                        if (!hard_break) {
                            return false
                        }

                        dispatch(state.tr.replaceSelectionWith(hard_break.create()).scrollIntoView())

                        return true
                    }

                    // 普通 Enter 如果 suggestion 菜单打开，让 suggestionPlugin 处理
                    if (editor.suggestionMenus.shown) {
                        return false
                    }

                    if (onEnter) {
                        onEnter()
                        return true
                    }
                    return false
                },
            },

        })
    }
}