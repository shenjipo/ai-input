import { Plugin, PluginKey } from 'prosemirror-state'
import MEditor from '../../editor'
import { MentionItem } from '../SuggestionMenu/types'

export class MentionDeletePlugin {
    public readonly plugin: Plugin

    constructor(editor: MEditor, onMentionDelete?: (item: MentionItem) => void) {
        this.plugin = new Plugin({
            key: new PluginKey('mention-delete'),

            appendTransaction(transactions, oldState, newState) {
                if (!transactions.some(tr => tr.docChanged)) {
                    return null
                }

                const oldMentions = new Map<string, any>()
                const newMentionIds = new Set<string>()

                oldState.doc.descendants(node => {
                    if (node.type.name === 'mention' && node.attrs.id) {
                        oldMentions.set(node.attrs.id, node.attrs)
                    }
                })

                newState.doc.descendants(node => {
                    if (node.type.name === 'mention' && node.attrs.id) {
                        newMentionIds.add(node.attrs.id)
                    }
                })

                for (const [id, attrs] of oldMentions.entries()) {
                    if (!newMentionIds.has(id)) {
                        onMentionDelete?.({
                            id: attrs.id,
                            label: attrs.label,
                        })
                    }
                }
            },
        })
    }
} 
