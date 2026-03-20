// src/commands/viewAllShows.ts
import Table from 'cli-table3'
import type { shows } from './db/schema'

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