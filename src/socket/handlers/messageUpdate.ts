import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, channel_id: channelId, id } = d;

  const channel = await ChannelUtils.findText(bot, guildId, channelId);

  const message = await channel.messages.get(id);

  const { before, after } = await message.update(d);

  bot.events.emit(BotEvent.MessageUpdate, before, after);
};
