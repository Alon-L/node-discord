import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, id } = d;

  const channel = ChannelUtils.find(bot, guildId, id);

  if (!channel) return;

  const { before, after } = channel.update(d);

  bot.events.emit(BotEvents.ChannelUpdate, before, after);
};

export const name = GatewayEvents.ChannelUpdate;
