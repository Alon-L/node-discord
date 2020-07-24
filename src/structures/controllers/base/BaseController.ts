import BaseStruct, { BaseStructWithId } from '../../BaseStruct';
import Bot from '../../bot/Bot';
import ControllerCache from '../ControllerCache';

/**
 * Provides a base interface for the bot's cached data
 * @template T
 */
abstract class BaseController<T extends BaseStructWithId> {
  /**
   * The bot instance
   */
  public bot: Bot;

  /**
   * The cached data this controller contains
   */
  public cache: ControllerCache<T>;

  constructor(struct: BaseStruct | Bot, limit?: number) {
    if (struct instanceof Bot) {
      this.bot = struct;
    } else {
      this.bot = struct.bot;
    }

    this.cache = new ControllerCache<T>(null, limit);
  }
}

export default BaseController;
