"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_1 = require("../../structures/guild");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId, user } = d;
    const guild = await bot.guilds.get(guildId);
    const ban = new guild_1.GuildBan(bot, { user }, guild);
    // Add the member to the guild's bans controller
    guild.bans.cache.add(ban);
    bot.events.emit(constants_1.BotEvent.GuildBanAdd, ban);
};
