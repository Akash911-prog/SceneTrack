// src/commands/viewAllShows.ts
import Table from 'cli-table3'
import { shows, timestamps } from './db/schema'
import { OPTIONS, type fields, type showTypes } from './constants'
import { select, text } from '@clack/prompts'
import { db } from './db/client'
import { fuzzySearch } from './components/fuzzySearch'

const STATUS_COLOR: Record<string, string> = {
    watching: '\x1b[36m',  // cyan
    watched: '\x1b[32m',  // green
    planning: '\x1b[33m',  // yellow
    dropped: '\x1b[31m',  // red
    paused: '\x1b[35m',  // magenta
}
const RESET = '\x1b[0m'
const DIM = '\x1b[2m'

function colorStatus(status: string) {
    const c = STATUS_COLOR[status] ?? ''
    return `${c}${status}${RESET}`
}

export function buildTable(rows: typeof shows.$inferSelect[]) {
    const table = new Table({
        head: ['Title', 'Type', 'Status', 'Progress', 'Rating'],
        colWidths: [32, 14, 12, 12, 8],
        style: { head: ['cyan'], border: ['dim'] },
        chars: {
            top: '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
            bottom: '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
            left: '│', 'left-mid': '├', mid: '─', 'mid-mid': '┼',
            right: '│', 'right-mid': '┤', middle: '│'
        }
    })

    for (const show of rows) {
        const progress = show.type === 'movie'
            ? '-'
            : show.totalEpisodes
                ? `${show.watchedEpisodes}/${show.totalEpisodes}`
                : `${show.watchedEpisodes}/-`

        table.push([
            show.title.slice(0, 29),
            `${DIM}${show.type}${RESET}`,
            colorStatus(show.status),
            `${DIM}${progress}${RESET}`,
            show.rating ? `${show.rating}/10` : `${DIM}-${RESET}`,
        ])
    }

    return table.toString()
}

export type ShowRecord = typeof shows.$inferSelect

export async function promptForField(field: fields, current: ShowRecord) {
    switch (field) {
        case 'title':
            return text({
                message: 'New title:',
                defaultValue: current.title,
                validate: v => (!v || v.length === 0) ? 'Title is required' : undefined
            })

        case 'type':
            return select({
                message: 'New type:',
                options: [...OPTIONS.showTypes]
            })

        case 'status':
            return select({
                message: 'New status:',
                options: [...OPTIONS.statusOptions]
            })

        case 'rating':
            return text({
                message: 'New rating (1-10):',
                defaultValue: current.rating?.toString() ?? '',
                validate: v => {
                    if (!v) return undefined
                    const n = Number(v)
                    if (isNaN(n) || n < 1 || n > 10) return 'Must be between 1 and 10'
                }
            })

        case 'genre':
            return text({
                message: 'New genre:',
                defaultValue: current.genre ?? '',
            })

        case 'notes':
            return text({
                message: 'New notes:',
                defaultValue: current.notes ?? '',
            })

        case 'totalEpisodes':
            return text({
                message: 'Total episodes:',
                defaultValue: current.totalEpisodes?.toString() ?? '',
                validate: v => {
                    if (v && isNaN(Number(v))) return 'Must be a number'
                }
            })

        case 'watchedEpisodes':
            return text({
                message: 'Watched episodes:',
                defaultValue: current.watchedEpisodes.toString(),
                validate: v => {
                    if (v && isNaN(Number(v))) return 'Must be a number'
                }
            })

        case 'startedAt':
            return text({
                message: 'Started at (YYYY-MM-DD):',
                defaultValue: current.startedAt?.toISOString().slice(0, 10) ?? '',
                validate: v => {
                    if (v && isNaN(Date.parse(v))) return 'Invalid date'
                }
            })

        case 'finishedAt':
            return text({
                message: 'Finished at (YYYY-MM-DD):',
                defaultValue: current.finishedAt?.toISOString().slice(0, 10) ?? '',
                validate: v => {
                    if (v && isNaN(Date.parse(v))) return 'Invalid date'
                }
            })
    }
}

export async function fuzzyFindShow(): Promise<number> {
    const allShows = await db.select().from(shows);

    const items = allShows.map(show => ({
        label: `${show.title} — ${show.type} · ${show.status}`,
        value: show.id
    }))

    const showId = await fuzzySearch({
        message: "Which Show you want to edit:",
        items: items
    }) as number

    return showId;
}

export function buildTableTimeStamp(rows: typeof timestamps.$inferSelect[], show: typeof shows.$inferSelect, showShow: boolean) {
    const table = new Table({
        head: showShow ? ['Show', 'Episode', 'Timestamp', 'Note'] : [],
        colWidths: [32, 14, 12, 12, 8],
        style: { head: ['cyan'], border: ['dim'] },
        chars: {
            top: '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
            bottom: '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
            left: '│', 'left-mid': '├', mid: '─', 'mid-mid': '┼',
            right: '│', 'right-mid': '┤', middle: '│'
        }
    })

    for (const show of rows) {
        const progress = show.type === 'movie'
            ? '-'
            : show.totalEpisodes
                ? `${show.watchedEpisodes}/${show.totalEpisodes}`
                : `${show.watchedEpisodes}/-`

        table.push([
            show.title.slice(0, 29),
            `${DIM}${show.type}${RESET}`,
            colorStatus(show.status),
            `${DIM}${progress}${RESET}`,
            show.rating ? `${show.rating}/10` : `${DIM}-${RESET}`,
        ])
    }

    return table.toString()
}