import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId, id } = d;

  const channel = ChannelUtils.findText(bot, guildId, channelId);

  if (!channel) return;

  const message = channel.messages.get(id);

  if (!message) return;

  const { before, after } = message.update(d);

  bot.events.emit(BotEvents.MessageUpdate, before, after);
};
