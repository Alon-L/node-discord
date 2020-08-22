import Collection from '../../Collection';
import { Positions } from '../../api';
import { GuildChannel, CreateGuildChannelOptions } from '../../structures/channels';
import { Guild } from '../../structures/guild';
import { Snowflake } from '../../types';
import {
  BaseCreateController,
  BaseDeleteController,
  BaseFetchAllController,
  BaseFetchController,
} from '../base';

/**
 * Provides an interface for a guild's channels cache.
 * The guild channels a mapped by their IDs
 */
export class GuildChannelsController extends BaseFetchController<GuildChannel>
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
   * @returns {Promise<Collection<Snowflake, GuildChannel>>}
   */
  public async fetchAll(): Promise<Collection<Snowflake, GuildChannel>> {
    const channels = await this.bot.api.fetchGuildChannels(this.guild.id);

    this.cache.merge(channels);

    return channels;
  }

  /**
   * Swaps the positions of 2 guild channels with one another
   * @param {GuildChannel} channel1 The first guild channel
   * @param {GuildChannel} channel2 The second guild channel
   * @returns {Promise<void>}
   */
  public async swap(channel1: GuildChannel, channel2: GuildChannel): Promise<void> {
    const positions = { [channel1.id]: channel2.position, [channel2.id]: channel1.position };

    return this.bot.api.modifyGuildChannelsPositions(this.guild.id, positions);
  }

  /**
   * Modifies the positions of a set of channels for the guild.
   * Requires the {@Link Permission.ManageChannels} permission
   * @param {Positions} positions The new positions for the guild channels
   * @returns {Promise<void>}
   */
  public async modifyPositions(positions: Positions): Promise<void> {
    return this.bot.api.modifyGuildChannelsPositions(this.guild.id, positions);
  }
}
