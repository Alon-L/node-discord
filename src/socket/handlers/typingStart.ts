import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import Member from '../../structures/member/Member';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

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

  bot.events.emit(BotEvent.TypingStart, channel, user, timestamp as number);
};
