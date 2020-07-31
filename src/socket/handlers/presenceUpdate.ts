import { Bot, MemberPresence } from '../../structures';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const {
    user: { id: memberId },
    guild_id: guildId,
  } = d;

  const guild = await bot.guilds.get(guildId);

  const member = guild.members.get(memberId);

  if (!member) return;

  const { presence } = member;

  // Manual update due to presence's possibility of being undefined
  const before = presence?.clone();
  const after = presence?.init(d) || (member.presence = new MemberPresence(bot, d, member));

  bot.events.emit(BotEvent.PresenceUpdate, before, after);
};
