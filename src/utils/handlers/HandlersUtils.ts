import { PayloadData } from '../../socket/BotSocketShard';
import Bot from '../../structures/bot/Bot';

class HandlersUtils {
  protected readonly bot: Bot;
  protected readonly data: PayloadData;

  constructor(bot: Bot, data: PayloadData) {
    this.bot = bot;
    this.data = data;
  }
}

export default HandlersUtils;
