import BotHandler from './BotHandler';
import { Command, CommandFunction } from '../../types';

type RegisterCallback = CommandFunction | Command;

class BotCommands extends BotHandler<RegisterCallback> {
  public run(name: string): boolean {
    const command = this.find(name);

    if (!command) return false;

    if (typeof command === 'function') {
      command(this.bot);
    } else {
      command.execute(this.bot);
    }

    return true;
  }
}

export default BotCommands;
