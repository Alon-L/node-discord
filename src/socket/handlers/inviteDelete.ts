import Invite, { PartialInvite } from '../../structures/Invite';
import Bot from '../../structures/bot/Bot';
import GuildChannel from '../../structures/channels/GuildChannel';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, channel_id: channelId, code } = d;

  const guild = bot.guilds.get(guildId);

  const channel = await bot.channels.getOrFetch(channelId);

  const invite: Invite | PartialInvite = guild?.invites.get(code) || {
    channelId: channelId,
    guild,
    code,
  };

  // Delete the invite from the guild's invites cache
  guild?.invites.cache.delete(code);

  if (channel instanceof GuildChannel) {
    // Delete the invite from the guild channel's invites cache
    channel.invites.cache.delete(invite.code);
  }

  bot.events.emit(BotEvent.InviteDelete, invite);
};
