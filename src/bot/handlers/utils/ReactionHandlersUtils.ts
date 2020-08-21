import { HandlersUtils } from './HandlersUtils';
import { Emoji, Message } from '../../../structures';

/**
 * Provides util methods for all reactions-related handlers
 */
export class ReactionHandlersUtils extends HandlersUtils {
  /**
   * Returns the {@link Emoji} received from the event data
   * @type {Emoji}
   */
  public get emoji(): Emoji {
    return new Emoji(this.bot, this.data.emoji);
  }

  /**
   * Returns the message extracted from the event data
   * @type {Message | undefined}
   */
  public async getMessage(): Promise<Message> {
    const { channel_id: channelId, message_id: messageId } = this.data;

    const channel = await this.bot.channels.getText(channelId);

    return channel.messages.get(messageId);
  }
}
