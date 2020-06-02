import HandlersUtils from './HandlersUtils';
import Emoji from '../../structures/Emoji';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import Message from '../../structures/message/Message';

class ReactionHandlersUtils extends HandlersUtils {
  public get emoji(): Emoji {
    return new Emoji(this.bot, this.data.emoji);
  }

  public get message(): Message | undefined {
    const { guild_id: guildId, channel_id: channelId, message_id: messageId } = this.data;

    const guild = this.bot.guilds.get(guildId);

    const channel = guild
      ? (guild.channels.get(channelId) as GuildTextChannel)
      : this.bot.dms.get(channelId);

    if (!channel) return;

    // TODO: Fetch message if not found in the messages cache using channel.fetch.message()
    return channel.messages.get(messageId);
  }
}

export default ReactionHandlersUtils;
