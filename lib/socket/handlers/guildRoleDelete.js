"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId, role_id: roleId } = d;
    const guild = await bot.guilds.get(guildId);
    const role = guild.roles.cache.get(roleId);
    if (!role)
        return;
    // Remove the role from the guild's roles cache
    guild.roles.cache.delete(role.id);
    bot.events.emit(constants_1.BotEvent.GuildRoleDelete, role);
};
