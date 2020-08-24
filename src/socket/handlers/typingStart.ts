import { Bot } from '../../bot';
import { GuildTextChannel } from '../../structures/channels';
import { Member } from '../../structures/member';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { channel_id: channelId, timestamp, member } = d;

  const channel = await bot.channels.getText(channelId);

  // Retrieve user / member from the channel
  const user =
    channel instanceof GuildTextChannel
      ? new Member(bot, member!, channel.guild)
      : channel.recipient;

  bot.events.emit(BotEvent.TypingStart, channel, user, timestamp as number);
};
