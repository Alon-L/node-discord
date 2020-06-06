import Bot from '../../structures/bot/Bot';
import Guild from '../../structures/guild/Guild';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const oldGuild = Guild.find(bot, d.id);

  const newGuild = Guild.create(bot, d);

  // Cache the updated guild
  Guild.cache(bot, newGuild);

  bot.events.emit(BotEvents.GuildUpdate, oldGuild, newGuild);
};

export const name = GatewayEvents.GuildUpdate;
