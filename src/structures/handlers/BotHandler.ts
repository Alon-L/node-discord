import { EventEmitter } from 'events';
import Bot from '../bot/Bot';

abstract class BotHandler<T> extends EventEmitter {
  protected bot: Bot;

  protected constructor(bot: Bot) {
    super();

    this.bot = bot;
  }

  abstract wait(name: string): Promise<unknown>;
}

export default BotHandler;
