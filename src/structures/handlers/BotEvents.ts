import BotHandler from './BotHandler';
import { EventFunction } from '../../types';

type RegisterCallback = EventFunction;

class BotEvents extends BotHandler<RegisterCallback> {
  public run(name: string): boolean {
    const command = this.find(name);

    if (!command) return false;

    if (typeof command === 'function') {
      command(this.bot);
    }

    return true;
  }
}

export default BotEvents;
