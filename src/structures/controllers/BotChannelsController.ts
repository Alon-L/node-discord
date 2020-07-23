import BaseDeleteController from './base/BaseDeleteController';
import BaseFetchController from './base/BaseFetchController';
import { Snowflake } from '../../types/types';
import Channel from '../channels/Channel';

/**
 * Provides an interface for the bot's channels cache.
 * The channels are mapped by their IDs
 */
class BotChannelsController extends BaseFetchController<Channel>
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

export default BotChannelsController;
