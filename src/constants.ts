import { mkdirSync } from "fs"
import { homedir } from "os"
import path from "path"

const mainMenu = [
    { value: 'addShow', label: '1. Add Show' },
    { value: 'editShow', label: '2. Edit Show' },
    { value: 'removeShow', label: '3. Remove Show' },
    { value: 'viewAllShows', label: '4. View All Shows' },
    { value: 'timeStamp', label: '5. timeStamps' },
    { value: 'search', label: '6. Search Show in Watchlist' },
    { value: 'importExport', label: '7. Import / Export ( JSON )' },
    { value: 'exit', label: '8. Exit' },
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

const timeStampMenu = [
    { value: 'addTimestamp', label: '1. Add Timestamp' },
    { value: 'editTimestamp', label: '2. Edit Timestamp' },
    { value: 'removeTimestamp', label: '3. Remove Timestamp' },
    { value: 'viewTimestamp', label: '4. View Timestamp from a Show' },
    { value: 'viewAllTimestamps', label: '5. View All Timestamps' },
    { value: 'back', label: '6. Go Back' }
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

const timeStampFields = [
    { value: 'episode', label: 'Episode' },
    { value: 'time', label: 'Time' },
    { value: 'note', label: 'Note' },
] as const;

const filterOptions = {
    type: [
        { value: 'series', label: 'Series' },
        { value: 'movie', label: 'Movie' },
        { value: 'anime', label: 'Anime' },
        { value: 'documentary', label: 'Documentary' },
    ],
    status: [
        { value: 'planning', label: 'Planning' },
        { value: 'watching', label: 'Watching' },
        { value: 'watched', label: 'Watched' },
        { value: 'dropped', label: 'Dropped' },
        { value: 'paused', label: 'Paused' },
    ],
    rating: [
        { value: '1', label: '1 ' },
        { value: '2', label: '2 ' },
        { value: '3', label: '3 ' },
        { value: '4', label: '4 ' },
        { value: '5', label: '5 ' },
        { value: '6', label: '6 ' },
        { value: '7', label: '7 ' },
        { value: '8', label: '8 ' },
        { value: '9', label: '9 ' },
        { value: '10', label: '10 ' },
    ],
}

export enum ShowType {
    Series = 'series',
    Movie = 'movie',
    Anime = 'anime',
    Documentary = 'documentary',
}

export enum ShowStatus {
    Planning = 'planning',
    Watching = 'watching',
    Watched = 'watched',
    Dropped = 'dropped',
    Paused = 'paused',
}

export type importExport = {
    title: string,
    type: ShowType,
    status: ShowStatus,
    rating?: number,
    notes?: string,
    genre?: string,
    totalEpisode?: number,
    watchedEpisode?: number,
    startedAt?: Date,
    finishedAt?: Date
}

export const OPTIONS = {
    mainMenu,
    showTypes,
    statusOptions,
    fields,
    timeStampMenu,
    timeStampFields,
    filterOptions
}

export const PAGE_SIZE = 8
export const RESET = '\x1b[0m'
export const DIM = '\x1b[2m'
export const defaultExportPath = path.join(homedir(), '.scenetrack/exports')
export const defaultImportPath = path.join(homedir(), '.scenetrack/imports')

export type MainMenuChoice = typeof mainMenu[number]['value']
export type showTypes = typeof showTypes[number]['value']
export type statusOptions = typeof statusOptions[number]['value']
export type fields = typeof fields[number]['value']
export type fieldsArray = Array<fields>
export type timeStampMenu = typeof timeStampMenu[number]['value']
export type TimestampField = typeof timeStampFields[number]['value'];
type TypeValue = typeof filterOptions['type'][number]['value'];
type StatusValue = typeof filterOptions['status'][number]['value'];
type RatingValue = typeof filterOptions['rating'][number]['value'];

export type SelectedFilters = {
    type?: TypeValue;
    status?: StatusValue;
    rating?: RatingValue;
}