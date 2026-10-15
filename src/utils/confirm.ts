import { createInterface } from 'node:readline';

// Pregunta al usuario y devuelve true solo si responde "s" o "S".
// Sin terminal interactiva se considera no confirmado.
export async function confirm(question: string): Promise<boolean> {
  if (!process.stdin.isTTY) {
    return false;
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 's');
    });
  });
}
