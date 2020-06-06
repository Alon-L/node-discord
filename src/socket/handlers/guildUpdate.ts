import Bot from '../../structures/bot/Bot';
import Guild from '../../structures/guild/Guild';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { id } = d;

  const guild = Guild.find(bot, id);

  if (!guild) return;

  const { before, after } = guild.update(d);

  bot.events.emit(BotEvents.GuildUpdate, before, after);
};

export const name = GatewayEvents.GuildUpdate;
