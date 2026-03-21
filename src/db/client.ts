import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import path from 'path';
import * as schema from './schema'
import { homedir } from "os";
import { mkdirSync } from "fs";
import { sql } from "drizzle-orm";

const dataDir = path.join(homedir(), '.scenetrack/dbfiles')
mkdirSync(dataDir, { recursive: true })

const sqlite = new Database(path.join(dataDir, 'scenetrack.db'));
export const db = drizzle(sqlite, { schema });

db.run(sql`CREATE TABLE IF NOT EXISTS shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'series',
    status TEXT NOT NULL DEFAULT 'planning',
    rating INTEGER,
    notes TEXT,
    genre TEXT,
    total_episodes INTEGER,
    watched_episodes INTEGER NOT NULL DEFAULT 0,
    started_at INTEGER,
    finished_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
)`)

db.run(sql`CREATE TABLE IF NOT EXISTS timestamps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    episode INTEGER,
    time TEXT,
    note TEXT,
    logged_at INTEGER
)`)