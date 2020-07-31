import { Snowflake } from '../../types';
import { BaseStruct, GatewayStruct } from '../BaseStruct';
import { Bot } from '../bot';

/**
 * The type of a channel
 */
export enum ChannelType {
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
 */
export class Channel extends BaseStruct {
  /**
   * The ID of this channel
   */
  public id!: Snowflake;

  /**
   * The type of this channel
   */
  public type!: ChannelType;

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

  /**
   * Deletes a {@link GuildChannel}, or closes a {@link DMChannel}. Requires the {@link Permission.ManageChannels} permission for the guild
   * @returns {Promise<Channel>}
   */
  public delete(): Promise<Channel> {
    return this.bot.api.deleteChannel(this.id);
  }
}
