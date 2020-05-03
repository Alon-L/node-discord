import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import Guild from '../../structures/guild/Guild';
import { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = Guild.find(bot, d.guild_id);

  const user = new User(bot, d.user);

  // Member of the guild or the previously defined user
  const member = guild instanceof Guild ? guild.members.get(user.id) || user : user;

  // Remove the member from the guild's members cluster
  if (guild instanceof Guild) {
    guild.members.delete(member.id);
  }

  // TODO: Guild bans cluster field. Add member to that cluster

  bot.events.emit(GatewayEvents.GuildBanAdd, guild, member);
};

export const name = GatewayEvents.GuildBanAdd;
