const mainMenu = [
    { value: 'addShow', label: '1. Add Show' },
    { value: 'editShow', label: '2. Edit Show' },
    { value: 'removeShow', label: '3. Remove Show' },
    { value: 'viewAllShows', label: '4. View All Shows' },
    { value: 'exit', label: '5. Exit' },
] as const

const showTypes = [
    { value: 'series', label: 'Series' },
    { value: 'movie', label: 'Movie' },
    { value: 'anime', label: 'Anime' },
    { value: 'documentary', label: 'Documentary' },
] as const

const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'watching', label: 'Watching' },
    { value: 'watched', label: 'Watched' },
    { value: 'dropped', label: 'Dropped' },
    { value: 'paused', label: 'Paused' },
] as const

const fields = [
    { label: 'Title', value: 'title' },
    { label: 'Type', value: 'type' },
    { label: 'Status', value: 'status' },
    { label: 'Rating', value: 'rating' },
    { label: 'Notes', value: 'notes' },
    { label: 'Genre', value: 'genre' },
    { label: 'Total Episodes', value: 'totalEpisodes' },
    { label: 'Watched Episodes', value: 'watchedEpisodes' },
    { label: 'Started At', value: 'startedAt' },
    { label: 'Finished At', value: 'finishedAt' },
] as const

export const OPTIONS = {
    mainMenu,
    showTypes,
    statusOptions,
    fields
}

export const PAGE_SIZE = 8
export const RESET = '\x1b[0m'
export const DIM = '\x1b[2m'

export type MainMenuChoice = typeof mainMenu[number]['value']
export type showTypes = typeof showTypes[number]['value']
export type statusOptions = typeof statusOptions[number]['value']
export type fields = typeof fields[number]['value']
export type fieldsArray = Array<fields>