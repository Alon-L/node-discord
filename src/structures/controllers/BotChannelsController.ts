import BaseController from './BaseController';
import { Snowflake } from '../../types/types';
import Channel from '../channels/Channel';

class BotChannelsController extends BaseController<Channel> {
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
