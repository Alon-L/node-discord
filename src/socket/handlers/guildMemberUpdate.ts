import Member from '../../structures/Member';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = bot.guilds.get(d.guild_id);

  if (!guild) return;

  const oldMember = guild.members.get(d.user.id);

  if (!oldMember) return;

  const newMember = new Member(
    bot,
    {
      nick: oldMember.nick,
      joined_at: oldMember.joinedAt.date,
      deaf: oldMember.deaf,
      mute: oldMember.mute,
      ...d,
    },
    guild,
  );

  guild.members.set(oldMember.id, newMember);

  bot.events.emit(BotEvents.GuildMemberUpdate, oldMember, newMember);
};

export const name = GatewayEvents.GuildMemberUpdate;
