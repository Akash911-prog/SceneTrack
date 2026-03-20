import { addShow } from "./shows/add"
import { editShow } from "./shows/edit"
import { removeShow } from "./shows/remove"
import { viewAllShows } from "./shows/viewAll"

const mainMenu: Record<string, () => Promise<void>> = {
    addShow,
    editShow,
    removeShow,
    viewAllShows
}

export const FUNCTION_MAP = {
    mainMenu: mainMenu
}