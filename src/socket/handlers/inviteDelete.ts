import Invite, { PartialInvite } from '../../structures/Invite';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId, code } = d;

  const guild = bot.guilds.get(guildId);

  const invite: Invite | PartialInvite = guild?.invites.get(code) || {
    channelId: channelId,
    guild,
    code,
  };

  // Delete the invite from the guild invites cluster
  guild?.invites.delete(code);

  bot.events.emit(BotEvents.InviteDelete, invite);
};

export const name = GatewayEvents.InviteDelete;
