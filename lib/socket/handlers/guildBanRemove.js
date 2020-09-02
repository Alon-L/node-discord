"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId, user } = d;
    const guild = await bot.guilds.get(guildId);
    // Retrieve the ban if cached
    const ban = guild.bans.cache.has(user.id) ? guild.bans.cache.get(user.id) : undefined;
    // Remove the member from the Guild's bans Collection
    guild.bans.cache.delete(user.id);
    bot.events.emit(constants_1.BotEvent.GuildBanRemove, ban);
};
