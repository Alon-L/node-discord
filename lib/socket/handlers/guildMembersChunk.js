"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const member_1 = require("../../structures/member");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { not_found: notFound, guild_id: guildId, members, presences, nonce, chunk_index: chunkIndex, chunk_count: chunkCount, } = d;
    if (notFound) {
        throw new Error('An invalid ID was passed to the Guild Members request');
    }
    const guild = await bot.guilds.get(guildId);
    // Add the new members to the guild's members cache
    guild.members.cache.addMany(members.map((member) => new member_1.Member(bot, member, guild)));
    // Assign the presence returned from the event
    if (presences) {
        for (const presence of presences) {
            const { id } = presence.user;
            const member = await guild.members.get(id);
            if (member.presence) {
                // Re-initialize the member presence class with the updated presence
                member.presence.init(presence);
            }
            else {
                // Initialize the member presence class if not cached
                member.presence = new member_1.MemberPresence(bot, presence, member);
            }
        }
    }
    // This chunk's information
    const chunk = {
        index: chunkIndex,
        count: chunkCount,
    };
    bot.events.emit(constants_1.BotEvent.GuildMembersChunk, guild, nonce, chunk);
    if (chunk.index === chunk.count - 1) {
        // This is the last chunk of the request, activate the GuildMembersChunkFinish event
        bot.events.emit(constants_1.BotEvent.GuildMembersChunkFinish, guild, nonce);
    }
};
