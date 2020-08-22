import { ChannelMessagesController, ChannelPinsController } from '../../controllers';
import { Snowflake } from '../../types';
import { Message, MessageData, MessageOptions, MessageEmbed } from '../message';

/**
 * Abstract class that all text-based channels implement
 */
export interface TextChannel {
  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  lastMessageId: Snowflake | null | undefined;

  /**
   * The text channel's messages controller
   */
  messages: ChannelMessagesController;

  /**
   * The text channel's pinned messages controller
   */
  pins: ChannelPinsController;

  // TODO: Add example to "3. A {@link MessageEmbed} instance"
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
   * @example ```typescript
   * channel.sendMessage({ content: 'Hello World!', files: [{ path: './my_image.png', name: 'image.png' }] });
   * ```
   * 3. A {@link MessageEmbed} instance
   * @param {MessageOptions} options
   * @returns {Promise<Message>}
   */
  sendMessage(
    data: string | MessageData | MessageEmbed,
    options?: MessageOptions,
  ): Promise<Message>;

  /**
   * Posts a typing indicator for a specified text channel.
   * Useful when the bot is responding to a command and expects the computation to take a few seconds.
   * This method may be called to let the user know that the bot is processing their message.
   * @returns {Promise<void>}
   */
  triggerTyping(): Promise<void>;
}
