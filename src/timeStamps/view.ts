import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { shows, timestamps } from "../db/schema";
import { buildTableTimeStamp, fuzzyFindShow, type RowTimeStamp } from "../libs";
import { DIM, PAGE_SIZE, RESET } from "../constants";
import { emitKeypressEvents, type Key } from "readline";
import { log } from "@clack/prompts";

export async function viewTimestamp() {
    const showId = await fuzzyFindShow() as number;

    const timeStamps = await db.select().from(timestamps).where(eq(timestamps.showId, showId));
    const showArray = await db.select().from(shows).where(eq(shows.id, showId));

    if (timeStamps.length === 0) {
        log.warning(`${DIM}No timestamps in your watchlist yet.${RESET}`);
        return
    }

    if (showArray.length === 0 || showArray === undefined) {
        log.warning(`${DIM}No shows in your watchlist yet.${RESET}`);
        return
    }

    const show = showArray[0]!;

    let offset = 0;

    function render() {
        console.clear()
        const part = timeStamps.slice(offset, offset + PAGE_SIZE)
        const page: RowTimeStamp[] = [
            {
                show: show,
                timestamps: part
            }
        ]
        console.log(buildTableTimeStamp(page, true))

        const remaining = timeStamps.length - offset - PAGE_SIZE
        if (remaining > 0) {
            process.stdout.write(`${DIM}  ↑↓ scroll · ${remaining} more · q to go back${RESET}\n`)
        } else {
            process.stdout.write(`${DIM}  ↑↓ scroll · end · q to go back${RESET}\n`)
        }
    }

    render()

    if (!process.stdin.listenerCount('keypress')) {
        emitKeypressEvents(process.stdin)
    }
    process.stdin.setRawMode(true)
    process.stdin.resume()

    await new Promise<void>((resolve) => {
        process.stdin.on('keypress', function handler(_, key) {
            if (!key) return

            if (key.name === 'q' || key.name === 'escape') {
                process.stdin.removeListener('keypress', handler)
                // process.stdin.setRawMode(false)
                process.stdin.pause()
                console.clear()
                resolve()
                return
            }

            if (key.name === 'down' || key.name === 'return') {
                if (offset + PAGE_SIZE < timeStamps.length) {
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


export async function viewAllTimestamps() {
    const allTimestamps = await db.select().from(timestamps);
    if (allTimestamps.length === 0) {
        log.warning(`${DIM}No timestamps found.${RESET}`);
        return;
    }

    const grouped = new Map<number, typeof timestamps.$inferSelect[]>();
    for (const ts of allTimestamps) {
        if (!grouped.has(ts.showId)) grouped.set(ts.showId, []);
        grouped.get(ts.showId)!.push(ts);
    }

    const rows: RowTimeStamp[] = [];
    for (const [showId, tsGroup] of grouped) {
        const showArray = await db.select().from(shows).where(eq(shows.id, showId));
        if (showArray.length === 0) continue;
        rows.push({ show: showArray[0]!, timestamps: tsGroup });
    }

    let offset = 0;

    const render = () => {
        console.clear();
        const pageRows = rows.slice(offset, offset + PAGE_SIZE);
        console.log(buildTableTimeStamp(pageRows, true));

        const remaining = allTimestamps.length - offset - PAGE_SIZE
        if (remaining > 0) {
            process.stdout.write(`${DIM}  ↑↓ scroll · ${remaining} more · q to go back${RESET}\n`)
        } else {
            process.stdout.write(`${DIM}  ↑↓ scroll · end · q to go back${RESET}\n`)
        }
    };

    render();

    // Switch stdin to raw mode to capture individual keypresses
    emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

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
                if (offset + PAGE_SIZE < allTimestamps.length) {
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