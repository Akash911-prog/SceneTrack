import { eq, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { timestamps } from "../db/schema";
import { fuzzyFindShow } from "../libs";
import { fuzzySearch } from "../components/fuzzySearch";
import { autocomplete, autocompleteMultiselect, confirm, log } from "@clack/prompts";
import { ExitPromptError } from "@inquirer/core";

export async function removeTimestamp() {

    try {

        const showId = await fuzzyFindShow() as number;
        const timeStamps = await db.select().from(timestamps).where(eq(timestamps.showId, showId));

        const items = timeStamps.map(elem => {
            return {
                value: elem.id,
                label: `episode: ${elem.episode} - timestamp: ${elem.time} - note: ${elem.note}`
            }
        })

        const toDelete = await autocompleteMultiselect({
            message: "Select timestamps to delete (space to select | enter to continue)",
            options: items
        }) as number[]

        const confirmed = await confirm({
            message: "Are you sure you want to delete these timestamps?:"
        })

        if (confirmed) {
            await db.delete(timestamps).where(inArray(timestamps.id, toDelete));
            log.success("Successfully Deleted the Timestamps")
        }
        else {
            log.error("Cancelled Deletion")
        }

    } catch (error) {
        if (error instanceof ExitPromptError) {
            log.error("No Value Selected!");
        }
        else {
            log.error(`Error at remove. ${error}`)
        }
        return;
    }

}