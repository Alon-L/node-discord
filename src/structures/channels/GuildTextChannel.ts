import GuildChannel from './GuildChannel';
import TextChannel from './TextChannel';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import { GatewayStruct } from '../BaseStruct';
import Timestamp from '../Timestamp';
import Bot from '../bot/Bot';
import Guild from '../guild/Guild';
import Message, { MessageOptions, MessageData } from '../message/Message';
import MessageEmbed from '../message/MessageEmbed';

/**
 * Represents a channel found in a guild of type {@link ChannelType.GuildText}
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

    this.messages = new Cluster<Snowflake, Message>(null, this.bot.options.cache.messagesLimit);
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

  /**
   * Post a message to a {@link GuildTextChannel} or {@link DMChannel}. If operating on a {@link GuildTextChannel}, this endpoint requires the {@link Permission.SendMessages} permission to be present on the current user. If the {@link MessageOptions.tts} field is set to true, the {@link Permission.SendTTSMessages} permission is required for the message to be spoken
   * @param {string | Partial<MessageData> | MessageEmbed} data The message data.
   * Can be:
   * 1. Raw content to be sent as a message
   * @example ```typescript
   * channel.sendMessage('Hello World!');
   * ```
   * 2. A partial {@link MessageData} object, containing content and/or embed
   * @example ```typescript
   * channel.sendMessage({ content: 'Hello World!', embed: { title: 'My Embed!' } });
   * ```
   * 3. A {@link MessageEmbed} instance
   * @param {Partial<MessageOptions>} options The message's options
   * @returns {Promise<Message>}
   */
  public sendMessage(
    data: string | Partial<MessageData> | MessageEmbed,
    options?: Partial<MessageOptions>,
  ): Promise<Message> {
    return this.bot.api.sendMessage(this.id, data, options);
  }
}

export default GuildTextChannel;
