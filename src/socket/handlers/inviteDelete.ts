import { PartialInvite, Invite } from '../../structures';
import { Bot } from '../../structures/bot';
import { GuildChannel } from '../../structures/channels';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, channel_id: channelId, code } = d;

  const guild = await bot.guilds.get(guildId);

  const channel = await bot.channels.get(channelId);

  const invite: Invite | PartialInvite = guild?.invites.cache.get(code) || {
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
