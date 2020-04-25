import Cluster from '../../Cluster';
import Bot from '../Bot';

abstract class BotHandler<T> extends Cluster<string, T> {
  protected bot: Bot;

  constructor(bot: Bot) {
    super();

    this.bot = bot;
  }

  abstract wait(name: string): Promise<unknown>;

  protected find(name: string): T {
    if (this.has(name)) {
      return this.get(name);
    }
    return undefined;
  }
}

export default BotHandler;
