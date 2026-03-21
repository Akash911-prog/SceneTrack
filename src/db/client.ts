import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import path from 'path';
import * as schema from './schema'
import { homedir } from "os";
import { mkdirSync } from "fs";

const dataDir = path.join(homedir(), '.scenetrack/dbfiles')
mkdirSync(dataDir, { recursive: true })

const sqlite = new Database(path.join(dataDir, 'scenetrack.db'));
export const db = drizzle(sqlite, { schema });

console.log(process.cwd())

const migrationsFolder = path.join(process.cwd(), '/src/db/migrations')
migrate(db, { migrationsFolder })