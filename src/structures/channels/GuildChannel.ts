import Channel from './Channel';
import GuildCategoryChannel from './GuildCategoryChannel';
import { GatewayStruct } from '../BaseStruct';
import Bot from '../bot/Bot';
import Guild from '../guild/Guild';

/**
 * Represents a channel found in a guild of any type
 */
class GuildChannel extends Channel {
  /**
   * The guild this channel is associated to
   */
  public guild!: Guild;

  /**
   * Sorting position of the channel
   */
  public position!: number;

  /**
   * The name of the channel
   */
  public name!: string;

  /**
   * The topic of the channel.
   * Possibly null if channel does not have a topic
   */
  public topic!: string | null;

  /**
   * Parent {@link GuildCategoryChannel} of this channel.
   * Possibly undefined if this channel does not have a parent category channel, or the category is not cached
   */
  public category: GuildCategoryChannel | undefined;

  constructor(bot: Bot, guildChannel: GatewayStruct, guild: Guild) {
    super(bot, guildChannel);

    this.guild = this.bot.guilds.get(guildChannel.guild_id) || guild;
  }

  /**
   * @ignore
   * @param {GatewayStruct} guildChannel The guild channel data
   * @returns {this}
   */
  public init(guildChannel: GatewayStruct): this {
    super.init(guildChannel);

    this.position = guildChannel.position;
    this.name = guildChannel.name;
    this.topic = guildChannel.topic;

    // Retrieves the parent category channel from cache
    const category = this.guild.channels.get(guildChannel.parent_id);
    if (category && category instanceof GuildCategoryChannel) {
      this.category = category;
    }

    return this;
  }
}

export default GuildChannel;
