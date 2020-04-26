import GuildChannel from './GuildChannel';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';

class GuildCategoryChannel extends GuildChannel {
  /**
   * All {@link GuildChannel}s under this category channel
   * @type {Cluster<Snowflake, GuildChannel>}
   */
  public get children(): Cluster<Snowflake, GuildChannel> {
    return this.guild.channels.filter(c => c.parent.id === this.id);
  }
}

export default GuildCategoryChannel;
