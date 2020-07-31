import { BaseDeleteController, BaseFetchController } from './base';
import { Snowflake } from '../../types';
import { Channel } from '../channels';

/**
 * Provides an interface for the bot's channels cache.
 * The channels are mapped by their IDs
 */
export class BotChannelsController extends BaseFetchController<Channel>
  implements BaseDeleteController<Channel> {
  /**
   * Deletes a channel
   * @param {Snowflake} id The ID of the channel you wish to delete
   * @returns {Promise<void | Channel>}
   */
  delete(id: Snowflake): Promise<void | Channel> {
    return this.bot.api.deleteChannel(id);
  }

  /**
   * Fetches a channel
   * @param {Snowflake} id The ID of the channel you wish to fetch
   * @returns {Promise<Channel>}
   */
  fetch(id: Snowflake): Promise<Channel> {
    return this.bot.api.fetchChannel(id);
  }
}
