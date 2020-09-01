"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_1 = require("../../structures/guild");
const constants_1 = require("../constants");
exports.default = ({ d }, bot, socket) => {
    const { session_id: sessionId } = d;
    socket.sessionId = sessionId;
    const guild = guild_1.Guild.create(bot, d, socket.shard.id);
    if (guild instanceof guild_1.Guild) {
        // Delete the guild from the unavailable guilds collection if exists
        if (bot.unavailableGuilds.has(guild.id)) {
            bot.unavailableGuilds.delete(guild.id);
        }
        bot.guilds.cache.add(guild);
    }
    else {
        bot.unavailableGuilds.set(guild.id, guild);
    }
    // The socket is still processing incoming GuildCreate events
    if (socket.state === 1 /* Processing */) {
        // Remove this guild from the pending guilds cache
        socket.pendingGuilds.delete(guild.id);
        if (!socket.pendingGuilds.size) {
            // Fire the ready event if no guilds are pending
            socket.ready();
        }
    }
    else {
        bot.events.emit(constants_1.BotEvent.GuildCreate, guild);
    }
};
