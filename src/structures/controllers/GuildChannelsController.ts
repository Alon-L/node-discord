import BaseCreateController from './base/BaseCreateController';
import BaseDeleteController from './base/BaseDeleteController';
import BaseFetchAllController from './base/BaseFetchAllController';
import BaseFetchController from './base/BaseFetchController';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import GuildChannel, { CreateGuildChannelOptions } from '../channels/GuildChannel';
import Guild from '../guild/Guild';

/**
 * Provides an interface for a guild's channels cache.
 * The guild channels a mapped by their IDs
 */
class GuildChannelsController extends BaseFetchController<GuildChannel>
  implements
    BaseCreateController<GuildChannel, CreateGuildChannelOptions>,
    BaseDeleteController<GuildChannel>,
    BaseFetchAllController<GuildChannel> {
  /**
   * The guild this controller is associated to
   */
  public readonly guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

  /**
   * Creates a new guild channel in the guild associated to this controller.
   * Requires the {@link Permission.ManageChannels}
   * @param {CreateGuildChannelOptions} options The options for the new guild channel
   * @returns {Promise<GuildChannel>}
   */
  public create(options: CreateGuildChannelOptions): Promise<GuildChannel> {
    return this.bot.api.createGuildChannel(this.guild.id, options);
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

  /**
   * Fetches and caches all channels the guild associated to this controller
   * @returns {Promise<Cluster<Snowflake, GuildChannel>>}
   */
  public async fetchAll(): Promise<Cluster<Snowflake, GuildChannel>> {
    const channels = await this.bot.api.fetchGuildChannels(this.guild.id);

    this.cache.merge(channels);

    return channels;
  }
}

export default GuildChannelsController;
