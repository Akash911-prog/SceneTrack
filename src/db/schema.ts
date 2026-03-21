import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const shows = table('shows', {
    id: t.int().primaryKey({ autoIncrement: true }),
    title: t.text().notNull(),
    type: t.text({ enum: ['series', 'movie', 'anime', 'documentary'] }).notNull().default('series'),
    status: t.text({ enum: ['planning', 'watching', 'watched', 'dropped', 'paused'] }).notNull().default('planning'),
    rating: t.int(),           // 1-10, nullable until watched
    notes: t.text(),
    genre: t.text(),
    totalEpisodes: t.int(),    // null if unknown or movie
    watchedEpisodes: t.int().notNull().default(0),
    startedAt: t.int({ mode: 'timestamp' }),
    finishedAt: t.int({ mode: 'timestamp' }),
    createdAt: t.int({ mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: t.int({ mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const timestamps = table('timestamps', {
    id: t.int().primaryKey({ autoIncrement: true }),
    showId: t.int().notNull().references(() => shows.id, { onDelete: 'cascade' }),
    episode: t.int(),
    time: t.text(),
    note: t.text(),                // e.g. "finished season 2", "took a break"
    loggedAt: t.int({ mode: 'timestamp' }).$defaultFn(() => new Date()),
})