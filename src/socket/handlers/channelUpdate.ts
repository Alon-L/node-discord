import { Bot } from '../../bot';
import { ChannelUtils } from '../../structures/channels/utils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, id } = d;

  const channel = await ChannelUtils.find(bot, guildId, id);

  const { before, after } = channel.update(d);

  bot.events.emit(BotEvent.ChannelUpdate, before, after);
};
