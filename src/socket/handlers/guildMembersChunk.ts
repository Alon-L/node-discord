import { GatewayStruct } from '../../structures/BaseStruct';
import Member from '../../structures/Member';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { not_found: notFound, guild_id: guildId, members, presences } = d;

  if (notFound) throw new Error('An invalid ID was passed to the Guild Members request');

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  guild.members.merge(
    members.map((member: GatewayStruct) => [member.user.id, new Member(bot, member, guild)]),
  );

  if (presences) {
    // TODO: Do something with the presences
  }

  bot.events.emit(BotEvents.GuildMembersChunk, guild);
};

export const name = GatewayEvents.GuildMembersChunk;
