import { emitKeypressEvents } from "readline"
import { DIM, OPTIONS, PAGE_SIZE, RESET } from "../constants"
import { db } from "../db/client"
import { shows } from "../db/schema"
import { buildTable, getFilters } from "../libs"
import { and, inArray } from "drizzle-orm"
import { confirm } from "@clack/prompts"


export async function viewAllShows() {

    const addFilter = await confirm({
        message: "Add filters?",
        initialValue: false
    })
    let allShows: typeof shows.$inferSelect[];

    if (!addFilter) {
        allShows = db.select().from(shows).all();
    } else {
        const filters = await getFilters() as string[];
        const selectedTypes = OPTIONS.filterOptions.type
            .filter(o => filters.includes(o.value))
            .map(o => o.value) as typeof shows.$inferSelect['type'][];

        const selectedStatuses = OPTIONS.filterOptions.status
            .filter(o => filters.includes(o.value))
            .map(o => o.value) as typeof shows.$inferSelect['status'][];

        const selectedRatings = OPTIONS.filterOptions.rating
            .filter(o => filters.includes(o.value))
            .map(o => Number(o.value));

        allShows = await db.select().from(shows).where(and(
            selectedStatuses.length ? inArray(shows.status, selectedStatuses) : undefined,
            selectedTypes.length ? inArray(shows.type, selectedTypes) : undefined,
            selectedRatings.length ? inArray(shows.rating, selectedRatings) : undefined,
        ))
    }


    if (allShows.length === 0) {
        console.log(`${DIM}No shows in your watchlist yet.${RESET}`)
        return
    }

    let offset = 0

    function render() {
        console.clear()
        const page = allShows.slice(offset, offset + PAGE_SIZE)
        console.log(buildTable(page))

        const remaining = allShows.length - offset - PAGE_SIZE
        if (remaining > 0) {
            process.stdout.write(`${DIM}  ↑↓ scroll · ${remaining} more · q to go back${RESET}\n`)
        } else {
            process.stdout.write(`${DIM}  ↑↓ scroll · end · q to go back${RESET}\n`)
        }
    }

    render()

    emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)
    process.stdin.resume()

    await new Promise<void>((resolve) => {
        process.stdin.on('keypress', function handler(_, key) {
            if (!key) return

            if (key.name === 'q' || key.name === 'escape') {
                process.stdin.setRawMode(false)
                process.stdin.pause()
                process.stdin.removeListener('keypress', handler)
                console.clear()
                resolve()
                return
            }

            if (key.name === 'down' || key.name === 'return') {
                if (offset + PAGE_SIZE < allShows.length) {
                    offset++
                    render()
                }
            }

            if (key.name === 'up') {
                if (offset > 0) {
                    offset--
                    render()
                }
            }
        })
    })
}