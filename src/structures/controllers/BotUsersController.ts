import { BaseFetchController } from './base';
import { Snowflake } from '../../types';
import { BotUser } from '../BotUser';
import { User } from '../User';
import { Bot } from '../bot';

/**
 * Provides an interface for the bot's users cache.
 * The users are mapped by their IDs
 */
export class BotUsersController extends BaseFetchController<User> {
  constructor(bot: Bot) {
    super(bot);
  }

  /**
   * Fetches the bot user
   * @returns {Promise<BotUser>}
   */
  public async fetchBot(): Promise<BotUser> {
    const user = await this.bot.api.fetchBotUser();

    this.cache.add(user);

    if (this.bot.user) {
      this.bot.user.update(user.structure);
    } else {
      this.bot.user = user;
    }

    return user;
  }

  /**
   * Fetches a user by its ID
   * @param {Snowflake} id The user ID
   * @returns {Promise<User>}
   */
  public async fetch(id: Snowflake): Promise<User> {
    const user = await this.bot.api.fetchUser(id);

    this.cache.add(user);

    return user;
  }
}
