import Channel, { ChannelType } from './Channel';
import GuildCategoryChannel from './GuildCategoryChannel';
import { Snowflake } from '../../types/types';
import { GatewayStruct } from '../BaseStruct';
import Bot from '../bot/Bot';
import Guild from '../guild/Guild';

export interface GuildChannelOptions {
  name: string;
  type: ChannelType.GuildText | ChannelType.GuildNews;
  topic: string | null;
  nsfw: boolean | null;
  slowModeTimeout: number | null;
  bitrate: number | null;
  userLimit: number | null;
}

/**
 * Represents a channel found in a guild of any type
 */
class GuildChannel extends Channel {
  /**
   * The guild this channel is associated to
   */
  public guild: Guild;

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
   * The ID of this channel's parent category
   */
  private parentId!: Snowflake;

  constructor(bot: Bot, guildChannel: GatewayStruct, guild: Guild) {
    super(bot, guildChannel);

    this.guild = guild;
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

    this.parentId = guildChannel.parent_id;

    return this;
  }

  /**
   * Parent {@link GuildCategoryChannel} of this channel.
   * Possibly null if this channel does not have a parent category channel, or the category is not cached
   */
  public get parent(): GuildCategoryChannel | null {
    const parent = this.guild.channels.get(this.parentId);

    return parent instanceof GuildCategoryChannel ? parent : null;
  }

  /**
   * Update a channel's settings. Requires the `MANAGE_CHANNELS` permission for the guild.
   * @param {Partial<GuildChannelOptions>} options The modified channel's settings
   * @returns {Promise<GuildChannel>}
   */
  public modify(options: Partial<GuildChannelOptions>): Promise<GuildChannel> {
    return this.bot.api.modifyChannel(this.id, options);
  }
}

export default GuildChannel;
