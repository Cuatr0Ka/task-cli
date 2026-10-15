import type { Command } from 'commander';
import { openDb, type Db } from '../db/connection.js';
import { listTasks } from '../db/tasks.js';
import { buildTable, shouldUseColor } from '../utils/format.js';
import { parsePriority, parseStatus } from '../utils/validation.js';

export interface ListOptions {
  status?: string;
  priority?: string;
}

// Devuelve la tabla de tareas (o un mensaje si no hay coincidencias).
export function runList(db: Db, options: ListOptions, width: number, color: boolean): string {
  const tasks = listTasks(db, {
    status: options.status ? parseStatus(options.status) : undefined,
    priority: options.priority ? parsePriority(options.priority) : undefined,
  });
  if (tasks.length === 0) {
    return 'No se encontraron tareas.';
  }
  return buildTable(tasks, width, color);
}

export function registerList(program: Command): void {
  program
    .command('list')
    .description('Lista las tareas en una tabla')
    .option('--status <estado>', 'filtra por estado: todo, in-progress o done')
    .option('--priority <prioridad>', 'filtra por prioridad: high, medium o low')
    .action((options: ListOptions) => {
      console.log(runList(openDb(), options, process.stdout.columns ?? 100, shouldUseColor()));
    });
}
