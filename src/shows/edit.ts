import { autocompleteMultiselect, cancel, isCancel, log } from "@clack/prompts";
import { ExitPromptError } from "@inquirer/core";
import { db } from "../db/client";
import { fuzzySearch } from "../components/fuzzySearch";
import { shows } from "../db/schema";
import { OPTIONS, type fields, type fieldsArray } from "../constants";
import { fuzzyFindShow, promptForField, type ShowRecord } from "../libs";
import { eq } from "drizzle-orm";
import { startCase, toLower } from "lodash-es";

export async function editShow() {
    try {

        // 1. find show
        const showId = await fuzzyFindShow() as number;

        // 2. get current data
        const current = db.select().from(shows).where(eq(shows.id, showId)).get()
        if (!current) return

        const selectedFields = await autocompleteMultiselect({
            message: "What fields do you want to edit? (space to select)",
            options: [...OPTIONS.fields]
        }) as fieldsArray

        const updates: Partial<ShowRecord> = {};

        for (const field of selectedFields) {
            const value = await promptForField(field, current)
            if (isCancel(value)) {
                cancel('Operation cancelled')
                return
            }

            // coerce types
            if (field === 'totalEpisodes' || field === 'watchedEpisodes' || field === 'rating') {
                updates[field] = value ? Number(value) : null as any
            } else if (field === 'startedAt' || field === 'finishedAt') {
                updates[field] = value ? new Date(value as string) : null as any
            } else if (field === 'title') {
                updates[field] = startCase(toLower(value));
            } else {
                updates[field] = value as any
            }
        }

        await db.update(shows).set({ ...updates, updatedAt: new Date() }).where(eq(shows.id, showId));

        log.success("Item Update Successfully");

    } catch (error) {
        if (error instanceof ExitPromptError) {
            log.error("No Value Selected!");
        }
        else {
            log.error(`Error at edit. ${error}`)
        }
    }
}
