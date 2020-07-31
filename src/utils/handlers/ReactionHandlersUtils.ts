import { HandlersUtils } from './HandlersUtils';
import { Message, Emoji } from '../../structures';
import { DMChannel, GuildTextChannel } from '../../structures/channels';

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

    const channel = await this.bot.channels.get(channelId);

    if (!(channel instanceof DMChannel || channel instanceof GuildTextChannel)) {
      throw new TypeError('The channel is not a valid text channel');
    }

    return channel.messages.get(messageId);
  }
}
