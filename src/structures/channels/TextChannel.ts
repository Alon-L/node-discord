import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import Timestamp from '../Timestamp';
import Message, { MessageData, MessageOptions } from '../message/Message';
import MessageEmbed from '../message/MessageEmbed';

/**
 * Abstract class that all text-based channels implement
 */
abstract class TextChannel {
  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  abstract lastMessageId: Snowflake | null | undefined;

  /**
   * Timestamp of when the last pinned message was pinned
   */
  abstract lastPinTimestamp: Timestamp | undefined;

  /**
   * Limited Cluster containing all cached messages sent in this channel
   */
  abstract messages: Cluster<Snowflake, Message>;

  // TODO: Add example to "3. A {@link MessageEmbed} instance"
  /**
   * Post a message to a {@link GuildTextChannel} or {@link DMChannel}. If operating on a {@link GuildTextChannel}, this endpoint requires the {@link Permission.SendMessages} permission to be present on the current user. If the {@link MessageOptions.tts} field is set to true, the {@link Permission.SendTTSMessages} permission is required for the message to be spoken
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
   * @param {Partial<MessageOptions>} options
   * @returns {Promise<Message>}
   */
  abstract sendMessage(
    data: string | MessageData | MessageEmbed,
    options?: Partial<MessageOptions>,
  ): Promise<Message>;

  /**
   * Post a typing indicator for a specified text channel.
   * Useful when the bot is responding to a command and expects the computation to take a few seconds.
   * This method may be called to let the user know that the bot is processing their message.
   * @returns {Promise<void>}
   */
  abstract triggerTyping(): Promise<void>;
}

export default TextChannel;
