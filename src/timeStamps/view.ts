import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { timestamps } from "../db/schema";
import { fuzzyFindShow } from "../libs";

export async function viewTimestamp() {
    const showId = await fuzzyFindShow();

    const timeStamps = db.select().from(timestamps).where(eq(timestamps.showId, showId));
}


export async function viewAllTimestamps() {

}