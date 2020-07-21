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
  public async delete(id: Snowflake): Promise<GuildChannel> {
    const channel = await this.bot.api.deleteGuildChannel(id);

    this.cache.delete(channel.id);
    this.bot.channels.cache.delete(channel.id);

    return channel;
  }

  /**
   * Fetches a guild channel
   * @param {Snowflake} id The ID of the guild channel you wish to fetch
   * @returns {Promise<GuildChannel>}
   */
  public async fetch(id: Snowflake): Promise<GuildChannel> {
    const channel = await this.bot.api.fetchGuildChannel(id);

    this.add(channel);
    this.bot.channels.add(channel);

    return channel;
  }
}

export default GuildChannelsController;
