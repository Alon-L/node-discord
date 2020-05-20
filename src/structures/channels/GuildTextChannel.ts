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
  public nsfw: boolean;

  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  public lastMessageId?: Snowflake | null;

  /**
   * Amount of seconds a user has to wait before sending another message
   */
  public slowModeTimeout!: number;

  /**
   * Timestamp of when the last pinned message was pinned
   */
  public lastPinTimestamp?: Timestamp;

  /**
   * Limited Cluster containing all cached messages sent in this channel
   */
  public messages: Cluster<Snowflake, Message>;

  // Guild parameter used when creating the channel from the Guild constructor
  constructor(bot: Bot, textChannel: GatewayStruct, guild_?: Guild) {
    const guild = bot.guilds.get(textChannel.guild_id) || guild_;

    if (!guild) throw new Error('Invalid text channel guild');

    super(bot, textChannel, guild);

    this.nsfw = textChannel.nsfw || false;
    this.lastMessageId = textChannel.last_message_id;
    this.slowModeTimeout = textChannel.rate_limit_per_user;
    this.lastPinTimestamp = new Timestamp(textChannel.last_pin_timestamp);

    // TODO: Turn this limit into a variable inside the bot's options
    this.messages = new Cluster<Snowflake, Message>(null, 3);
  }
}

export default GuildTextChannel;
