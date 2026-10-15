import Table from 'cli-table3';
import type { Task, TaskPriority, TaskStatus } from '../db/types.js';

const RESET = '\x1b[0m';
const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: '\x1b[33m',
  'in-progress': '\x1b[36m',
  done: '\x1b[32m',
};
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: '\x1b[31m',
  medium: '\x1b[33m',
  low: '\x1b[90m',
};

// Los colores se desactivan con NO_COLOR o cuando la salida no es una terminal.
export function shouldUseColor(): boolean {
  return process.env.NO_COLOR === undefined && Boolean(process.stdout.isTTY);
}

export function colorStatus(status: TaskStatus, enabled: boolean): string {
  return enabled ? `${STATUS_COLORS[status]}${status}${RESET}` : status;
}

export function colorPriority(priority: TaskPriority, enabled: boolean): string {
  return enabled ? `${PRIORITY_COLORS[priority]}${priority}${RESET}` : priority;
}

// Trunca el título con "…" si excede el ancho máximo.
export function truncateTitle(title: string, maxWidth: number): string {
  if (title.length <= maxWidth) {
    return title;
  }
  return `${title.slice(0, Math.max(maxWidth - 1, 0))}…`;
}

// Convierte una fecha ISO (UTC) a hora local con formato AAAA-MM-DD HH:mm.
export function formatDate(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Columnas fijas (6 + 15 + 12 + 20) más los 6 bordes verticales de la tabla.
const FIXED_COLUMNS_WIDTH = 6 + 15 + 12 + 20 + 6;
const MIN_TITLE_WIDTH = 10;

// Construye la tabla del listado ajustando el ancho del título a la terminal.
export function buildTable(tasks: Task[], width: number, color: boolean): string {
  const titleColumn = Math.max(width - FIXED_COLUMNS_WIDTH, MIN_TITLE_WIDTH + 2);
  const table = new Table({
    head: ['ID', 'Título', 'Estado', 'Prioridad', 'Creada'],
    colWidths: [6, titleColumn, 15, 12, 20],
    wordWrap: false,
    style: { head: [], border: [] },
  });
  for (const task of tasks) {
    table.push([
      String(task.id),
      truncateTitle(task.title.replace(/\s+/g, ' '), titleColumn - 2),
      colorStatus(task.status, color),
      colorPriority(task.priority, color),
      formatDate(task.createdAt),
    ]);
  }
  return table.toString();
}
