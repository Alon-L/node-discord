import { Bot } from '../../bot';
import { PayloadData } from '../BotSocketShard';

/**
 * Main class for all util methods for socket event handlers.
 */
export class HandlersUtils {
  /**
   * The bot associated to this socket event
   */
  protected readonly bot: Bot;

  /**
   * The data received from the socket event
   */
  protected readonly data: PayloadData;

  constructor(bot: Bot, data: PayloadData) {
    this.bot = bot;
    this.data = data;
  }
}
