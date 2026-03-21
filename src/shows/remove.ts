import { ExitPromptError } from "@inquirer/core";
import { db } from "../db/client";
import { shows } from "../db/schema";
import { confirm, log } from "@clack/prompts";
import { inArray } from "drizzle-orm";
import { fuzzyFindShow } from "../libs";

export async function removeShow() {

    try {

        const result = await fuzzyFindShow(true) as number[];

        const confirmed = await confirm({
            message: `Are you sure you want to remove the show?`
        })

        if (!confirmed) {
            log.error("Deletion cancelled");
            return;
        }

        await db.delete(shows).where(inArray(shows.id, result));
    } catch (error) {
        if (error instanceof ExitPromptError) {
            log.error("No Value Selected!");
        }
        else {
            log.error(`Error at remove. ${error}`)
        }
    }
}