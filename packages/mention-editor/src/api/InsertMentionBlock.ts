import { Selection } from 'prosemirror-state'
import MEditor from '../editor'

export function InsertMentionBlock(
    editor: MEditor,
    item: { id: string; label: string }
) {

    editor._tiptapEditor.chain().insertContent({
        type: 'mention',
        attrs: {
            id: item.id,
            label: item.label,
        }
    }).run()    

}

