import Member from '../../structures/Member';
import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { channel_id: channelId, guild_id: guildId, user_id: userId, timestamp, member } = d;

  const channel = ChannelUtils.findText(bot, guildId, channelId);

  let user: Member | User | undefined;

  if (channel) {
    // Channel is cached. Retrieve user / member from the channel
    user =
      channel instanceof GuildTextChannel
        ? new Member(bot, member!, channel.guild)
        : channel.recipient;
  } else {
    // Channel is not cached. Retrieve user from the Bot's users Cluster
    user = bot.users.get(userId);
  }

  bot.events.emit(BotEvents.TypingStart, channel, user, timestamp);
};
