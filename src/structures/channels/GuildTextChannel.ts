import GuildChannel from './GuildChannel';
import TextChannel from './TextChannel';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import Timestamp from '../Timestamp';
import Bot from '../bot/Bot';
import Guild from '../guild/Guild';
import Message from '../message/Message';

/**
 * Represents a channel found in a guild of type {@link ChannelTypes.GuildText}
 * @class
 * @extends GuildChannel
 * @implements {TextChannel}
 */
class GuildTextChannel extends GuildChannel implements TextChannel {
  /**
   * Whether the channel is configured as NSFW
   */
  public nsfw: boolean | undefined;

  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  public lastMessageId: Snowflake | null | undefined;

  /**
   * Amount of seconds a user has to wait before sending another message
   */
  public slowModeTimeout!: number;

  /**
   * Timestamp of when the last pinned message was pinned
   */
  public lastPinTimestamp: Timestamp | undefined;

  /**
   * Limited Cluster containing all cached messages sent in this channel
   */
  public messages: Cluster<Snowflake, Message>;

  // Guild parameter used when creating the channel from the Guild constructor
  constructor(bot: Bot, textChannel: GatewayStruct, guild: Guild) {
    super(bot, textChannel, guild);

    // TODO: Turn this limit into a variable inside the bot's options
    this.messages = new Cluster<Snowflake, Message>(null, 100);
  }

  /**
   * @ignore
   * @param {GatewayStruct} textChannel The text channel data
   * @returns {this}
   */
  public init(textChannel: GatewayStruct): this {
    super.init(textChannel);

    this.nsfw = textChannel.nsfw;
    this.lastMessageId = textChannel.last_message_id;
    this.slowModeTimeout = textChannel.rate_limit_per_user;
    this.lastPinTimestamp = new Timestamp(textChannel.last_pin_timestamp);

    return this;
  }
}

export default GuildTextChannel;
