import BotHandler from './BotHandler';
import { EventFunction } from '../../types';

type RegisterCallback = EventFunction;

class BotEvents extends BotHandler<RegisterCallback> {
  public run(name: string): boolean {
    const command = this.find(name);

    if (!command) return false;

    command(this.bot);

    return true;
  }

  public wait(name: string): Promise<Parameters<RegisterCallback>> {
    return new Promise(resolve => {
      this.set(name, (...args: Parameters<RegisterCallback>) => {
        resolve(args);
      });
    });
  }
}

export default BotEvents;
