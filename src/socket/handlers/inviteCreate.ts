import Invite from '../../structures/Invite';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const invite = new Invite(bot, d);

  // Add the invite to the guild invites cluster
  invite.guild?.invites.set(invite.code, invite);

  // Add the invite to the guild channel's invites cache
  invite.channel?.invites.add(invite);

  bot.events.emit(BotEvent.InviteCreate, invite);
};
