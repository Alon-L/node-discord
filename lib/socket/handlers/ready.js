"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
exports.default = ({ d }, bot, socket) => {
    const { session_id: sessionId, user, guilds } = d;
    socket.sessionId = sessionId;
    bot.user = new structures_1.BotUser(bot, user);
    bot.users.cache.add(bot.user);
    if (guilds.length) {
        // Store all pending guilds to later be retrieved from incoming gateway GUILD_CREATE events
        for (const guild of guilds) {
            bot.unavailableGuilds.set(guild.id, guild);
            socket.pendingGuilds.add(guild.id);
        }
    }
    else {
        // No pending guilds - the bot is ready!
        socket.ready();
    }
    bot.debug(bot.guilds, 'bot guilds');
};
