import { Bot, GuildTextChannel, Member } from '../../structures';
import { ChannelUtils } from '../../utils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { channel_id: channelId, guild_id: guildId, timestamp, member } = d;

  const channel = await ChannelUtils.findText(bot, guildId, channelId);

  // Retrieve user / member from the channel
  const user =
    channel instanceof GuildTextChannel
      ? new Member(bot, member!, channel.guild)
      : channel.recipient;

  bot.events.emit(BotEvent.TypingStart, channel, user, timestamp as number);
};
