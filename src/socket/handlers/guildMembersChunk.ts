import { Bot, GatewayStruct } from '../../structures';
import { Member, MemberPresence } from '../../structures/member';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

/**
 * Contains information about the current Guild Members Chunk
 */
export interface GuildMembersChunk {
  /**
   * The chunk index in the expected chunks for this response
   */
  index: number;

  /**
   * The total number of expected chunks for this response
   */
  count: number;
}

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const {
    not_found: notFound,
    guild_id: guildId,
    members,
    presences,
    nonce,
    chunk_index: chunkIndex,
    chunk_count: chunkCount,
  } = d;

  if (notFound) {
    throw new Error('An invalid ID was passed to the Guild Members request');
  }

  const guild = await bot.guilds.get(guildId);

  // Add the new members to the guild's members cache
  guild.members.merge(
    members.map((member: GatewayStruct) => [member.user.id, new Member(bot, member, guild)]),
  );

  // Assign the presences returned from the event
  if (presences) {
    for (const presence of presences) {
      const id = presence.user.id;
      const member = guild.members.get(id);

      if (!member) continue;

      if (member.presence) {
        // Re-initialize the member presence class with the updated presence
        member.presence.init(presence);
      } else {
        // Initialize the member presence class if not cached
        member.presence = new MemberPresence(bot, presence, member);
      }
    }
  }

  // This chunk's information
  const chunk: GuildMembersChunk = {
    index: chunkIndex,
    count: chunkCount,
  };

  bot.events.emit(BotEvent.GuildMembersChunk, guild, nonce, chunk);

  if (chunk.index === chunk.count - 1) {
    // This is the last chunk of the request, activate the GuildMembersChunkFinish event
    bot.events.emit(BotEvent.GuildMembersChunkFinish, guild, nonce);
  }
};
