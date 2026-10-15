import type { Db } from './connection.js';
import type { Task, TaskPriority, TaskStatus } from './types.js';

interface TaskRow {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
  };
}

export interface NewTask {
  title: string;
  description?: string;
  priority: TaskPriority;
}

// Inserta una tarea con estado "todo" y devuelve la tarea creada.
export function insertTask(db: Db, input: NewTask): Task {
  const result = db
    .prepare('INSERT INTO tasks (title, description, priority, created_at) VALUES (?, ?, ?, ?)')
    .run(input.title, input.description ?? null, input.priority, new Date().toISOString());
  return getTaskById(db, Number(result.lastInsertRowid)) as Task;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
}

// Lista las tareas (más recientes primero) aplicando los filtros indicados.
export function listTasks(db: Db, filters: TaskFilters = {}): Task[] {
  const conditions: string[] = [];
  const params: string[] = [];
  if (filters.status) {
    conditions.push('status = ?');
    params.push(filters.status);
  }
  if (filters.priority) {
    conditions.push('priority = ?');
    params.push(filters.priority);
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = db
    .prepare(`SELECT * FROM tasks ${where} ORDER BY created_at DESC, id DESC`)
    .all(...params) as TaskRow[];
  return rows.map(toTask);
}

export function updateTaskStatus(db: Db, id: number, status: TaskStatus): void {
  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, id);
}

export interface TaskChanges {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
}

// Actualiza solo los campos indicados.
export function updateTaskFields(db: Db, id: number, changes: TaskChanges): void {
  const sets: string[] = [];
  const params: (string | null)[] = [];
  if (changes.title !== undefined) {
    sets.push('title = ?');
    params.push(changes.title);
  }
  if (changes.description !== undefined) {
    sets.push('description = ?');
    params.push(changes.description);
  }
  if (changes.priority !== undefined) {
    sets.push('priority = ?');
    params.push(changes.priority);
  }
  if (sets.length === 0) {
    return;
  }
  db.prepare(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`).run(...params, id);
}

export function deleteTask(db: Db, id: number): void {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}

export function getTaskById(db: Db, id: number): Task | undefined {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow | undefined;
  return row ? toTask(row) : undefined;
}
