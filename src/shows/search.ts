import { autocompleteMultiselect, log } from "@clack/prompts";
import { db } from "../db/client";
import { shows } from "../db/schema";
import Table from 'cli-table3';
import { ExitPromptError } from "@inquirer/core";

export async function search() {
    try {
        const allShows = db.select().from(shows).all();
        if (!allShows.length) {
            log.error("No shows found.");
            return;
        }

        const selected = await autocompleteMultiselect({
            message: "Search for a show",
            options: allShows.map(s => ({ label: `${s.title} - ${s.type} • ${s.status}`, value: s })),
        }) as typeof shows.$inferSelect[];

        if (!selected.length) {
            log.error("No shows selected.");
            return;
        }

        const table = new Table({
            head: ['Title', 'Type', 'Status', 'Rating', 'Episodes', 'Watched', 'Genre', 'Started', 'Finished'],
            style: { head: ['cyan'] },
            wordWrap: true,
        });

        for (const show of selected) {
            table.push([
                show.title,
                show.type,
                show.status,
                show.rating ?? '-',
                show.totalEpisodes ?? '-',
                show.watchedEpisodes,
                show.genre ?? '-',
                show.startedAt ? new Date(show.startedAt).toLocaleDateString() : '-',
                show.finishedAt ? new Date(show.finishedAt).toLocaleDateString() : '-',
            ]);
        }

        console.clear();
        console.log(table.toString());
    } catch (error) {
        if (error instanceof ExitPromptError) {
            log.error("No Value Selected!");
        } else {
            log.error(`Error at viewShows. ${error}`);
        }
    }
}