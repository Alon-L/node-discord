import BaseController from './BaseController';
import { Snowflake } from '../../types/types';
import GuildChannel from '../channels/GuildChannel';

class GuildChannelsController extends BaseController<GuildChannel> {
  /**
   * Deletes a guild channel
   * @param {Snowflake} id The ID of the guild channel you wish to delete
   * @returns {Promise<GuildChannel>}
   */
  public delete(id: Snowflake): Promise<GuildChannel> {
    return this.bot.api.deleteGuildChannel(id);
  }

  /**
   * Fetches a guild channel
   * @param {Snowflake} id The ID of the guild channel you wish to fetch
   * @returns {Promise<GuildChannel>}
   */
  public fetch(id: Snowflake): Promise<GuildChannel> {
    return this.bot.api.fetchGuildChannel(id);
  }
}

export default GuildChannelsController;
