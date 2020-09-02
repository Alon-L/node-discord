"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId, user } = d;
    const guild = await bot.guilds.get(guildId);
    const member = guild.members.cache.get(user.id) || new structures_1.User(bot, user);
    // Remove the member from the guild's members cache
    guild.members.cache.delete(member.id);
    bot.events.emit(constants_1.BotEvent.GuildMemberRemove, member);
};
