import type { Command } from 'commander';
import { openDb, type Db } from '../db/connection.js';
import { getTaskById, updateTaskStatus } from '../db/tasks.js';
import { fail } from '../utils/errors.js';
import { transitionError } from '../utils/transitions.js';
import { parseId, parseStatus } from '../utils/validation.js';

// Cambia el estado de una tarea respetando las transiciones válidas.
export function runStatus(db: Db, rawId: string, rawStatus: string): string {
  const id = parseId(rawId);
  const newStatus = parseStatus(rawStatus);
  const task = getTaskById(db, id);
  if (!task) {
    fail(`La tarea ${id} no existe.`);
  }
  if (task.status === newStatus) {
    return `La tarea ${id} ya está en estado ${newStatus}.`;
  }
  const error = transitionError(task.status, newStatus);
  if (error) {
    fail(error);
  }
  updateTaskStatus(db, id, newStatus);
  return `Tarea ${id}: ${task.status} → ${newStatus}`;
}

export function registerStatus(program: Command): void {
  program
    .command('status <id> <estado>')
    .description('Cambia el estado de una tarea (todo, in-progress o done)')
    .action((id: string, status: string) => {
      console.log(runStatus(openDb(), id, status));
    });
}
