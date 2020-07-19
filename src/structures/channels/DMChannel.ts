import Channel from './Channel';
import TextChannel from './TextChannel';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import { GatewayStruct } from '../BaseStruct';
import Timestamp from '../Timestamp';
import User from '../User';
import Bot from '../bot/Bot';
import Message, { MessageData, MessageOptions } from '../message/Message';
import MessageEmbed from '../message/MessageEmbed';

/**
 * Represents a private channel between the Bot and a User
 * @extends Channel
 * @implements {TextChannel}
 */
class DMChannel extends Channel implements TextChannel {
  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  public lastMessageId: Snowflake | null | undefined;

  /**
   * The recipient of the DM
   */
  public recipient!: User;

  /**
   * Timestamp of when the last pinned message was pinned
   */
  public lastPinTimestamp: Timestamp | undefined;

  /**
   * Limited Cluster containing all cached messages sent in this channel
   */
  public messages!: Cluster<Snowflake, Message>;

  constructor(bot: Bot, dmChannel: GatewayStruct) {
    super(bot, dmChannel);

    this.messages = new Cluster<Snowflake, Message>(null, this.bot.options.cache.messagesLimit);
  }

  /**
   * @ignore
   * @param {GatewayStruct} dmChannel The DM channel data
   * @returns {this}
   */
  public init(dmChannel: GatewayStruct): this {
    super.init(dmChannel);

    this.lastMessageId = dmChannel.last_message_id;

    this.recipient = new User(this.bot, dmChannel.recipients[0]);

    this.lastPinTimestamp = new Timestamp(dmChannel.last_pin_timestamp);

    return this;
  }

  /**
   * Posts a message to a {@link GuildTextChannel} or {@link DMChannel}. If operating on a {@link GuildTextChannel}, this endpoint requires the {@link Permission.SendMessages} permission to be present on the current user. If the {@link MessageOptions.tts} field is set to true, the {@link Permission.SendTTSMessages} permission is required for the message to be spoken
   * @param {string | MessageData | MessageEmbed} data The message data.
   * Can be:
   * 1. Raw content to be sent as a message
   * @example ```typescript
   * channel.sendMessage('Hello World!');
   * ```
   * 2. A {@link MessageData} object, containing content and/or embed
   * @example ```typescript
   * channel.sendMessage({ content: 'Hello World!', embed: { title: 'My Embed!' } });
   * ```
   * 3. A {@link MessageEmbed} instance
   * @param {Partial<MessageOptions>} options The message's options
   * @returns {Promise<Message>}
   */
  public sendMessage(
    data: string | MessageData | MessageEmbed,
    options?: Partial<MessageOptions>,
  ): Promise<Message> {
    return this.bot.api.sendMessage(this.id, data, options);
  }

  /**
   * Posts a typing indicator for a specified text channel.
   * Useful when the bot is responding to a command and expects the computation to take a few seconds.
   * This method may be called to let the user know that the bot is processing their message.
   * @returns {Promise<void>}
   */
  public triggerTyping(): Promise<void> {
    return this.bot.api.triggerTextChannelTyping(this.id);
  }

  /**
   * Pins a message in a text channel.
   * Requires the {@link Permission.ManageMessages} permission
   * @param {Snowflake} messageId The ID of the message you wish to pin
   * @returns {Promise<void>}
   */
  public pinMessage(messageId: Snowflake): Promise<void> {
    return this.bot.api.pinMessage(this.id, messageId);
  }
}

export default DMChannel;
