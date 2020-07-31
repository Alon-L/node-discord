import { GuildChannel } from './GuildChannel';
import Collection from '../../Collection';
import { Snowflake } from '../../types';

/**
 * Represents a channel found in a guild of type {@link ChannelType.GuildCategory}
 */
export class GuildCategoryChannel extends GuildChannel {
  /**
   * Returns all {@link GuildChannel}s under this category channel
   * @type {Collection<Snowflake, GuildChannel>}
   */
  public get children(): Collection<Snowflake, GuildChannel> {
    return this.guild.channels.cache.filter(c => c.parent?.id === this.id);
  }
}
