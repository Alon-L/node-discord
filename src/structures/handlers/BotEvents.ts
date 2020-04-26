import { EventEmitter } from 'events';
import BotHandler from './BotHandler';
import { EventFunction } from '../../types';
import Bot from '../bot/Bot';

type RegisterCallback = EventFunction;

class BotEvents extends EventEmitter implements BotHandler<RegisterCallback> {
  private readonly bot: Bot;

  constructor(bot: Bot) {
    super();

    this.bot = bot;
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
