import { PRIORITIES, STATUSES, type TaskPriority, type TaskStatus } from '../db/types.js';
import { fail } from './errors.js';

// Valida un ID: debe ser un entero positivo.
export function parseId(value: string): number {
  if (!/^\d+$/.test(value.trim()) || Number(value) <= 0) {
    fail(`El ID "${value}" no es válido. Debe ser un número entero positivo.`);
  }
  return Number(value);
}

export function parsePriority(value: string): TaskPriority {
  if (!(PRIORITIES as readonly string[]).includes(value)) {
    fail(`La prioridad "${value}" no es válida. Valores permitidos: ${PRIORITIES.join(', ')}.`);
  }
  return value as TaskPriority;
}

export function parseStatus(value: string): TaskStatus {
  if (!(STATUSES as readonly string[]).includes(value)) {
    fail(`El estado "${value}" no es válido. Valores permitidos: ${STATUSES.join(', ')}.`);
  }
  return value as TaskStatus;
}

// Recorta el título y rechaza los vacíos.
export function validateTitle(value: string): string {
  const title = value.trim();
  if (title.length === 0) {
    fail('El título no puede estar vacío.');
  }
  return title;
}
