import Cluster from '../../Cluster';
import Bot from '../Bot';

class BotHandler<T> extends Cluster<string, T> {
  protected bot: Bot;

  constructor(bot: Bot) {
    super();

    this.bot = bot;
  }

  protected find(name: string): T {
    if (this.has(name)) {
      return this.get(name);
    }
    return undefined;
  }
}

export default BotHandler;
