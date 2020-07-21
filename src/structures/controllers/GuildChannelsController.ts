import BaseController from './BaseController';
import { Snowflake } from '../../types/types';
import GuildChannel from '../channels/GuildChannel';
import Guild from '../guild/Guild';

class GuildChannelsController extends BaseController<GuildChannel> {
  /**
   * The guild this controller is associated to
   */
  public readonly guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

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
