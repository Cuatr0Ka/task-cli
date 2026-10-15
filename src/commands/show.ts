import type { Command } from 'commander';
import { openDb, type Db } from '../db/connection.js';
import { getTaskById } from '../db/tasks.js';
import { fail } from '../utils/errors.js';
import { formatDate } from '../utils/format.js';
import { parseId } from '../utils/validation.js';

// Devuelve el detalle completo de una tarea.
export function runShow(db: Db, rawId: string): string {
  const id = parseId(rawId);
  const task = getTaskById(db, id);
  if (!task) {
    fail(`La tarea ${id} no existe.`);
  }
  return [
    `ID:          ${task.id}`,
    `Título:      ${task.title}`,
    `Descripción: ${task.description ?? '(sin descripción)'}`,
    `Estado:      ${task.status}`,
    `Prioridad:   ${task.priority}`,
    `Creada:      ${formatDate(task.createdAt)}`,
  ].join('\n');
}

export function registerShow(program: Command): void {
  program
    .command('show <id>')
    .description('Muestra el detalle completo de una tarea')
    .action((id: string) => {
      console.log(runShow(openDb(), id));
    });
}
