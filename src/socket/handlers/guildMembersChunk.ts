import { GatewayStruct } from '../../structures/BaseStruct';
import Bot from '../../structures/bot/Bot';
import Member from '../../structures/member/Member';
import { Payload } from '../BotSocketShard';
import { BotEvents } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
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
