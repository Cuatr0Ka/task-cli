import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export type Db = Database.Database;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL CHECK (length(trim(title)) > 0),
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'todo'   CHECK (status IN ('todo','in-progress','done')),
  priority    TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  created_at  TEXT NOT NULL
);
`;

// Devuelve la ruta de la base: TASK_CLI_DB si existe, o ~/.task-cli/tasks.db.
export function resolveDbPath(): string {
  return process.env.TASK_CLI_DB ?? join(homedir(), '.task-cli', 'tasks.db');
}

// Abre la base indicada (o ':memory:') y asegura que el esquema exista.
export function openDb(path: string = resolveDbPath()): Db {
  if (path !== ':memory:') {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new Database(path);
  db.exec(SCHEMA);
  return db;
}
