import { Snowflake } from '../../types/types';
import BaseStruct, { GatewayStruct } from '../BaseStruct';
import Bot from '../bot/Bot';

/**
 * The type of a channel
 */
export enum ChannelTypes {
  GuildText,
  DM,
  GuildVoice,
  GroupDM,
  GuildCategory,
  GuildNews,
  GuildStore,
}

/**
 * Represents a guild or DM channel within Discord.

 * @extends BaseStruct
 */
class Channel extends BaseStruct {
  /**
   * The ID of this channel
   */
  public id!: Snowflake;

  /**
   * The type of this channel
   */
  public type!: ChannelTypes;

  constructor(bot: Bot, channel: GatewayStruct) {
    super(bot, channel);

    this.init(channel);
  }

  /**
   * @ignore
   * @param {GatewayStruct} channel The channel data
   * @returns {this}
   */
  public init(channel: GatewayStruct): this {
    this.id = channel.id;
    this.type = channel.type;

    return this;
  }
}

export default Channel;
