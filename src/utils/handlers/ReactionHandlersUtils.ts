import HandlersUtils from './HandlersUtils';
import Emoji from '../../structures/Emoji';
import Message from '../../structures/message/Message';
import ChannelUtils from '../ChannelUtils';

/**
 * Provides util methods for all reactions-related handlers
 * @class
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
  public get message(): Message | undefined {
    const { guild_id: guildId, channel_id: channelId, message_id: messageId } = this.data;

    const channel = ChannelUtils.findText(this.bot, guildId, channelId);

    if (!channel) return;

    // TODO: Fetch message if not found in the messages cache using channel.fetch.message()
    return channel.messages.get(messageId);
  }
}

export default ReactionHandlersUtils;
