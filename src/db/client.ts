import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from 'path';
import * as schema from './schema'

const sqlite = new Database(path.join(process.cwd(), 'scenetrack.db'));
export const db = drizzle(sqlite, { schema, casing: 'snake_case' });