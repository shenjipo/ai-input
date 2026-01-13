import MEditor from "@shenjipo/mention-editor"
import Vue from "vue"

export type MEditorVue2Type = Vue & {
    editor: MEditor
    clear: () => void
}