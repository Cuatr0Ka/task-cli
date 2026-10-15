import type { Command } from 'commander';
import { openDb, type Db } from '../db/connection.js';
import { getTaskById, updateTaskFields, type TaskChanges } from '../db/tasks.js';
import { fail } from '../utils/errors.js';
import { parseId, parsePriority, validateTitle } from '../utils/validation.js';

export interface UpdateOptions {
  title?: string;
  description?: string;
  priority?: string;
}

// Modifica título, descripción o prioridad de una tarea existente.
export function runUpdate(db: Db, rawId: string, options: UpdateOptions): string {
  const id = parseId(rawId);
  if (!getTaskById(db, id)) {
    fail(`La tarea ${id} no existe.`);
  }
  const changes: TaskChanges = {};
  if (options.title !== undefined) {
    changes.title = validateTitle(options.title);
  }
  if (options.description !== undefined) {
    changes.description = options.description.trim() || null;
  }
  if (options.priority !== undefined) {
    changes.priority = parsePriority(options.priority);
  }
  if (Object.keys(changes).length === 0) {
    fail('No hay cambios que aplicar. Indica --title, --description o --priority.');
  }
  updateTaskFields(db, id, changes);
  return `Tarea ${id} actualizada.`;
}

export function registerUpdate(program: Command): void {
  program
    .command('update <id>')
    .description('Modifica el título, la descripción o la prioridad de una tarea')
    .option('-t, --title <texto>', 'nuevo título')
    .option('-d, --description <texto>', 'nueva descripción')
    .option('-p, --priority <prioridad>', 'nueva prioridad: high, medium o low')
    .action((id: string, options: UpdateOptions) => {
      console.log(runUpdate(openDb(), id, options));
    });
}
