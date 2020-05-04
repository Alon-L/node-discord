import { GatewayStruct } from '../../structures/BaseStruct';
import Member from '../../structures/Member';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  if (d.not_found) throw new Error('An invalid ID was passed to the Guild Members request');

  const guild = bot.guilds.get(d.guild_id);

  if (!guild) return;

  guild.members.merge(
    d.members.map((member: GatewayStruct) => [member.user.id, new Member(bot, member, guild)]),
  );

  if (d.presences) {
    // TODO: Do something with the presences
  }

  bot.events.emit(GatewayEvents.GuildMembersChunk, guild);
};

export const name = GatewayEvents.GuildMembersChunk;
