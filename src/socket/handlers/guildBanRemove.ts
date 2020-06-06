import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const user = new User(bot, d.user);

  // TODO: Guild bans cluster field. Remove user from that cluster

  bot.events.emit(BotEvents.GuildBanRemove, guild, user);
};

export const name = GatewayEvents.GuildBanRemove;
