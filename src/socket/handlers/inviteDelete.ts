import Invite, { PartialInvite } from '../../structures/Invite';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = bot.guilds.get(d.guild_id);

  const invite: Invite | PartialInvite = guild?.invites.get(d.code) || {
    channelId: d.channel_id,
    guild,
    code: d.code,
  };

  // Delete the invite from the guild invites cluster
  guild?.invites.delete(d.code);

  bot.events.emit(BotEvents.InviteDelete, invite);
};

export const name = GatewayEvents.InviteDelete;
