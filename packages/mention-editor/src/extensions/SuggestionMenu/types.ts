import { UiElementPosition } from "../../extensions-shared/UiElementPosition"

export type SuggestionMenuState = UiElementPosition & {
    query: string
    ignoreQueryLength?: boolean
}

export interface MentionItem {
    id: string,
    label: string
}