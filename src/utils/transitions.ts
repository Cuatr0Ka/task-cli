import type { TaskStatus } from '../db/types.js';

const VALID_TRANSITIONS: Record<TaskStatus, readonly TaskStatus[]> = {
  todo: ['in-progress'],
  'in-progress': ['done', 'todo'],
  done: ['todo'],
};

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

// Devuelve el motivo por el que la transición no es válida, o null si lo es.
export function transitionError(from: TaskStatus, to: TaskStatus): string | null {
  if (canTransition(from, to)) {
    return null;
  }
  if (from === 'todo' && to === 'done') {
    return 'No se puede completar una tarea sin trabajarla: debe pasar primero por in-progress.';
  }
  return `No se puede pasar de ${from} a ${to}. Desde ${from} solo se permite: ${VALID_TRANSITIONS[from].join(', ')}.`;
}
