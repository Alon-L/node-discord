import HandlersUtils from './HandlersUtils';
import Emoji from '../../structures/Emoji';
import DMChannel from '../../structures/channels/DMChannel';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import Message from '../../structures/message/Message';

/**
 * Provides util methods for all reactions-related handlers

 */
class ReactionHandlersUtils extends HandlersUtils {
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

    const channel = await this.bot.channels.getOrFetch(channelId);

    if (!(channel instanceof DMChannel || channel instanceof GuildTextChannel)) {
      throw new TypeError('The channel is not a valid text channel');
    }

    return channel.messages.getOrFetch(messageId);
  }
}

export default ReactionHandlersUtils;
