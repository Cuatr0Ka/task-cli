#!/usr/bin/env node
import { Command } from 'commander';
import { registerAdd } from './commands/add.js';
import { registerDelete } from './commands/delete.js';
import { registerList } from './commands/list.js';
import { registerShow } from './commands/show.js';
import { registerStatus } from './commands/status.js';
import { registerUpdate } from './commands/update.js';
import { fail, handleError, translateCommanderMessage } from './utils/errors.js';

const program = new Command();

program
  .name('task-cli')
  .description('Gestiona tus tareas personales desde la terminal')
  .version('1.0.0', '-V, --version', 'muestra la versión')
  .helpOption('-h, --help', 'muestra la ayuda')
  .helpCommand('help [comando]', 'muestra la ayuda de un comando')
  .configureOutput({ outputError: () => {} })
  .exitOverride();

registerAdd(program);
registerList(program);
registerShow(program);
registerStatus(program);
registerUpdate(program);
registerDelete(program);

async function main(): Promise<void> {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    const { code, exitCode, message } = error as { code?: string; exitCode?: number; message: string };
    if (code?.startsWith('commander.')) {
      // Ayuda y versión salen con su propio código; el resto son errores de uso.
      if (code === 'commander.helpDisplayed' || code === 'commander.version' || code === 'commander.help') {
        process.exit(exitCode ?? 0);
      }
      try {
        fail(translateCommanderMessage(message));
      } catch (userError) {
        handleError(userError);
      }
    }
    handleError(error);
  }
}

void main();
