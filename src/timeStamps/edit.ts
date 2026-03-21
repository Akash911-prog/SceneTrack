import { isCancel, cancel } from "@clack/prompts";
import { ExitPromptError } from "@inquirer/core";
import { log } from "@clack/prompts";
import { eq } from "drizzle-orm";
import { fuzzySearch } from "../components/fuzzySearch";
import { db } from "../db/client";
import { timestamps } from "../db/schema";
import { fuzzyFindShow, promptForTimestampField } from "../libs";
import { OPTIONS, type TimestampField } from "../constants";

export async function editTimestamp() {
    try {
        // 1. find show
        const showId = await fuzzyFindShow() as number;

        // 2. find timestamp for that show
        const timestampRows = db.select().from(timestamps).where(eq(timestamps.showId, showId)).all();
        if (!timestampRows.length) {
            log.error("No timestamps found for this show.");
            return;
        }

        const selectedTimestamp = await fuzzySearch({
            message: "Select a timestamp to edit",
            items: timestampRows.map(t => ({
                label: `Ep ${t.episode ?? '?'} | ${t.time ?? '?'} | ${t.note ?? ''} | ${t.loggedAt ? new Date(t.loggedAt).toLocaleDateString() : 'no date'}`,
                value: t.id
            })),
            multiple: false
        }) as number;

        const current = db.select().from(timestamps).where(eq(timestamps.id, selectedTimestamp)).get();
        if (!current) return;

        const selectedFields = await fuzzySearch({
            message: "What fields do you want to edit? (space to select)",
            items: [...OPTIONS.timeStampFields],
            multiple: true
        }) as TimestampField[];

        // 4. prompt for each field
        const updates: Partial<typeof timestamps.$inferInsert> = {};
        for (const field of selectedFields) {
            const value = await promptForTimestampField(field, current);
            if (isCancel(value)) {
                cancel('Operation cancelled');
                return;
            }

            if (field === 'episode') {
                updates[field] = value ? Number(value) : null as any;
            } else {
                updates[field] = value as any;
            }
        }

        console.log(updates);
        await db.update(timestamps).set(updates).where(eq(timestamps.id, selectedTimestamp));
        log.success("Timestamp updated successfully");

    } catch (error) {
        if (error instanceof ExitPromptError) {
            log.error("No Value Selected!");
        } else {
            log.error(`Error at editTimestamp. ${error}`);
        }
    }
}