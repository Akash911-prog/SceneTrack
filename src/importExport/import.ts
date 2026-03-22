import { mkdirSync } from "fs";
import { defaultImportPath, type importExport } from "../constants";
import { log, spinner } from "@clack/prompts";
import path from "path";
import { readFile } from "fs/promises";
import { shows } from "../db/schema";
import { db } from "../db/client";

export async function importShows(providedImportPath: string, filename: string) {
    try {
        const importPath = providedImportPath || defaultImportPath
        mkdirSync(importPath, { recursive: true });
        const fullPath = path.join(importPath, filename);

        const spin = spinner({ onCancel: () => log.warn('Cancelled') })
        spin.start('Importing...')

        try {
            const raw = await readFile(fullPath, 'utf-8')
            const data: importExport[] = JSON.parse(raw)

            for (const show of data) {
                db.insert(shows).values([{
                    title: show.title,
                    type: show.type,
                    status: show.status,
                    rating: show.rating ?? null,
                    notes: show.notes ?? null,
                    genre: show.genre ?? null,
                    totalEpisodes: show.totalEpisode ?? null,
                    watchedEpisodes: show.watchedEpisode ?? 0,
                    startedAt: show.startedAt ? new Date(show.startedAt) : null,
                    finishedAt: show.finishedAt ? new Date(show.finishedAt) : null,
                }]).run()
            }

            spin.stop(`Imported ${data.length} shows from: ${fullPath}`)
        } catch (error) {
            spin.stop('Import failed')
            log.error(error instanceof Error ? error.message : 'Unknown error')
        }
    } catch (error) {
        log.error(`${error}`);
    }
}