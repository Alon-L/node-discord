import { GuildChannel } from './GuildChannel';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';

/**
 * Represents a channel found in a guild of type {@link ChannelType.GuildCategory}
 */
export class GuildCategoryChannel extends GuildChannel {
  /**
   * Returns all {@link GuildChannel}s under this category channel
   * @type {Cluster<Snowflake, GuildChannel>}
   */
  public get children(): Cluster<Snowflake, GuildChannel> {
    return this.guild.channels.cache.filter(c => c.parent?.id === this.id);
  }
}
