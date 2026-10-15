import type { Command } from 'commander';
import { openDb, type Db } from '../db/connection.js';
import { deleteTask, getTaskById } from '../db/tasks.js';
import { confirm } from '../utils/confirm.js';
import { fail } from '../utils/errors.js';
import { parseId } from '../utils/validation.js';

export interface DeleteOptions {
  force?: boolean;
}

// Elimina una tarea; pide confirmación salvo que se use --force.
export async function runDelete(
  db: Db,
  rawId: string,
  options: DeleteOptions,
  ask: (question: string) => Promise<boolean> = confirm,
): Promise<string> {
  const id = parseId(rawId);
  if (!getTaskById(db, id)) {
    fail(`La tarea ${id} no existe.`);
  }
  if (!options.force && !(await ask(`¿Eliminar la tarea ${id}? (s/N) `))) {
    return 'Operación cancelada.';
  }
  deleteTask(db, id);
  return `Tarea ${id} eliminada.`;
}

export function registerDelete(program: Command): void {
  program
    .command('delete <id>')
    .description('Elimina una tarea (pide confirmación)')
    .option('--force', 'elimina sin pedir confirmación')
    .action(async (id: string, options: DeleteOptions) => {
      console.log(await runDelete(openDb(), id, options));
    });
}
