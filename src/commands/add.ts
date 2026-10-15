import type { Command } from 'commander';
import { openDb, type Db } from '../db/connection.js';
import { insertTask } from '../db/tasks.js';
import { parsePriority, validateTitle } from '../utils/validation.js';

export interface AddOptions {
  priority?: string;
  description?: string;
}

// Crea una tarea y devuelve el mensaje de confirmación.
export function runAdd(db: Db, title: string, options: AddOptions): string {
  const task = insertTask(db, {
    title: validateTitle(title),
    description: options.description?.trim() || undefined,
    priority: parsePriority(options.priority ?? 'medium'),
  });
  return `Tarea ${task.id} creada: ${task.title}`;
}

export function registerAdd(program: Command): void {
  program
    .command('add <título>')
    .description('Crea una tarea nueva')
    .option('-p, --priority <prioridad>', 'prioridad: high, medium o low (por defecto medium)')
    .option('-d, --description <texto>', 'descripción de la tarea')
    .action((title: string, options: AddOptions) => {
      console.log(runAdd(openDb(), title, options));
    });
}
