import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = bot.guilds.get(d.guild_id);

  if (!guild) return;

  const user = new User(bot, d.user);

  // Member of the guild or the previously defined user
  const member = guild.members.get(user.id) || user;

  // Remove the member from the guild's members cluster
  guild.members.delete(member.id);

  // TODO: Guild bans cluster field. Add member to that cluster

  bot.events.emit(GatewayEvents.GuildBanAdd, guild, member);
};

export const name = GatewayEvents.GuildBanAdd;
