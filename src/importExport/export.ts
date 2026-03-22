import { mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { defaultExportPath, ShowStatus, ShowType, type importExport } from "../constants";
import { db } from "../db/client";
import { shows } from "../db/schema";
import path from "path";
import { log, spinner } from "@clack/prompts";

export async function exportShows(providedExportPath: string) {

    try {

        const exportPath = providedExportPath || defaultExportPath
        mkdirSync(exportPath, { recursive: true });

        // making File name
        const filename = `scenetrack-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        // → scenetrack-2026-03-22T09-44-49-000Z.json
        const allShows = db.select().from(shows).all();

        const showsInExportFormat: importExport[] = allShows.map(show => {
            const entry: importExport = {
                title: show.title,
                type: show.type as unknown as ShowType,
                status: show.status as unknown as ShowStatus,
            }

            if (show.rating !== null) entry.rating = show.rating
            if (show.notes !== null) entry.notes = show.notes
            if (show.genre !== null) entry.genre = show.genre
            if (show.totalEpisodes !== null) entry.totalEpisode = show.totalEpisodes
            if (show.watchedEpisodes !== null) entry.watchedEpisode = show.watchedEpisodes
            if (show.startedAt !== null) entry.startedAt = new Date(show.startedAt)
            if (show.finishedAt !== null) entry.finishedAt = new Date(show.finishedAt)

            return entry
        })

        const fullPath = path.join(exportPath, filename)
        const spin = spinner({ onCancel: () => log.warn('Cancelled') })

        spin.start('Exporting...')
        try {
            await writeFile(fullPath, JSON.stringify(showsInExportFormat, null, 2), 'utf-8')
            spin.stop(`Exported to: ${fullPath}`)
            return
        } catch (err) {
            spin.stop('Export failed')
            log.error(err instanceof Error ? err.message : 'Unknown error')
        }

    } catch (error) {
        log.error(`${error}`);
        return;
    }
}