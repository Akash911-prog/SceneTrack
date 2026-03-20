import { ExitPromptError } from "@inquirer/core";
import { fuzzySearch } from "../components/fuzzySearch";
import { db } from "../db/client";
import { shows } from "../db/schema";
import { cancel, confirm, isCancel, log } from "@clack/prompts";
import { eq } from "drizzle-orm";

export async function removeShow() {

    try {

        const allShows = await db.select().from(shows);

        const items = allShows.map(show => ({
            label: `${show.title} — ${show.type} · ${show.status}`,
            value: show.id
        }))

        const result = await fuzzySearch({
            message: "Which Show you want to remove:",
            items: items
        }) as number

        const confirmed = await confirm({
            message: `Are you sure you want to remove the show?`
        })

        if (!confirmed) {
            log.info("Operation successfully cancelled");
            return;
        }

        await db.delete(shows).where(eq(shows.id, result));
    } catch (error) {
        if (error instanceof ExitPromptError) {
            log.error("No Value Selected!");
        }
        else {
            log.error(`Error at remove. ${error}`)
        }
    }
}