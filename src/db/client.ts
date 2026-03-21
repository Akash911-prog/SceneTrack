import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import path from 'path';
import * as schema from './schema'

const sqlite = new Database(path.join(process.cwd(), 'dbfiles/scenetrack.db'));
export const db = drizzle(sqlite, { schema });

console.log(process.cwd())

const migrationsFolder = path.join(process.cwd(), '/src/db/migrations')
migrate(db, { migrationsFolder })