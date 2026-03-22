import { importExport } from "./importExport/entry"
import { addShow } from "./shows/add"
import { editShow } from "./shows/edit"
import { removeShow } from "./shows/remove"
import { search } from "./shows/search"
import { viewAllShows } from "./shows/viewAll"
import { addTimestamp } from "./timeStamps/add"
import { editTimestamp } from "./timeStamps/edit"
import { showTimeStampMenu } from "./timeStamps/entry"
import { removeTimestamp } from "./timeStamps/remove"
import { viewAllTimestamps, viewTimestamp } from "./timeStamps/view"

const mainMenu: Record<string, () => Promise<void>> = {
    addShow,
    editShow,
    removeShow,
    viewAllShows,
    timeStamp: showTimeStampMenu,
    search,
    importExport
}

const timeStampMenu: Record<string, () => Promise<void>> = {
    addTimestamp,
    removeTimestamp,
    editTimestamp,
    viewAllTimestamps,
    viewTimestamp
}

export const FUNCTION_MAP = {
    mainMenu,
    timeStampMenu
}