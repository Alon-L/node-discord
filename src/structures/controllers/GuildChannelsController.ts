import BaseDeleteController from './base/BaseDeleteController';
import BaseFetchController from './base/BaseFetchController';
import { Snowflake } from '../../types/types';
import GuildChannel from '../channels/GuildChannel';
import Guild from '../guild/Guild';

/**
 * Provides an interface for a guild's channels cache.
 * The guild channels a mapped by their IDs
 */
class GuildChannelsController extends BaseFetchController<GuildChannel>
  implements BaseDeleteController<GuildChannel> {
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
  public async fetch(id: Snowflake): Promise<GuildChannel> {
    const channel = await this.bot.api.fetchGuildChannel(id);

    this.cache.add(channel);
    this.bot.channels.cache.add(channel);

    return channel;
  }
}

export default GuildChannelsController;
