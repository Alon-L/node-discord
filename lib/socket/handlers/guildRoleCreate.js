"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId } = d;
    const guild = await bot.guilds.get(guildId);
    const role = new structures_1.Role(bot, d.role, guild);
    // Add role to the guild's roles cache
    guild.roles.cache.add(role);
    bot.events.emit(constants_1.BotEvent.GuildRoleCreate, role);
};
