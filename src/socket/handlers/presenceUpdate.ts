import Bot from '../../structures/bot/Bot';
import MemberPresence from '../../structures/member/MemberPresence';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const {
    user: { id: memberId },
    guild_id: guildId,
  } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const member = guild.members.get(memberId);

  if (!member) return;

  const { presence } = member;

  // Manual update due to presence's possibility of being undefined
  const before = presence?.clone();
  const after = presence?.init(d) || (member.presence = new MemberPresence(bot, d, member));

  bot.events.emit(BotEvent.PresenceUpdate, before, after);
};
