import { ExitPromptError } from "@inquirer/core";
import { fuzzySearch } from "../components/fuzzySearch";
import { db } from "../db/client";
import { shows } from "../db/schema";
import { cancel, confirm, isCancel, log } from "@clack/prompts";
import { eq } from "drizzle-orm";
import { fuzzyFindShow } from "../libs";

export async function removeShow() {

    try {

        const result = await fuzzyFindShow()

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