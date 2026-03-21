import { cancel, group } from "@clack/prompts";
import { db } from "../db/client";
import { timestamps } from "../db/schema";
import { fuzzyFindShow } from "../libs";
import { text } from "@clack/prompts";
import { log } from "@clack/prompts";

export async function addTimestamp() {

    try {

        const showId = await fuzzyFindShow();
        const result = await group(
            {
                episode: () => text({
                    message: "Enter episode number:",
                    validate(value) {
                        if (!value || value.length === 0) return 'Required';
                        if (isNaN(Number(value))) return 'Please provide a number'
                    }
                }),

                time: () => text({
                    message: "Enter timestamp:",
                    validate: (value) => {
                        if (!value) return 'Timestamp is required';
                        if (!/^\d{2}:\d{2}$/.test(value)) return 'Format must be HH:MM (e.g. 23:45)';

                        const [hours, minutes] = value.split(':').map(Number);
                        if (hours === undefined || minutes === undefined) return 'Invalid timestamp';
                        if (hours > 23) return 'Hours must be between 00 and 23';
                        if (minutes > 59) return 'Minutes must be between 00 and 59';
                    }
                }),

                note: () => text({
                    message: "Note:",
                })
            },
            {
                onCancel: () => {
                    cancel("Operation Cancelled")
                    return
                }
            }
        )

        db.insert(timestamps).values({
            showId: showId,
            episode: Number(result.episode) as number,
            time: result.time as string,
            note: result.note as string | null
        })

        log.success("Timestamp Added Successfully")

    } catch (error) {
        cancel("Operation Cancelled")
        return
    }
}