import BotHandler from './BotHandler';
import { EventFunction } from '../../types';
import Bot from '../bot/Bot';

type RegisterCallback = EventFunction;

class BotEvents extends BotHandler<RegisterCallback> {
  constructor(bot: Bot) {
    super(bot);
  }

  public wait(name: string): Promise<Parameters<RegisterCallback>> {
    return new Promise(resolve => {
      const listener = (...args: Parameters<RegisterCallback>): void => {
        resolve(args);

        this.removeListener(name, listener);
      };

      this.on(name, listener);
    });
  }
}

export default BotEvents;
