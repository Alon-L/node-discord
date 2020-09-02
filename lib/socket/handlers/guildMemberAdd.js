"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Member_1 = require("../../structures/member/Member");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId } = d;
    const guild = await bot.guilds.get(guildId);
    const member = new Member_1.Member(bot, d, guild);
    // Cache the member in the guild's members cache
    guild.members.cache.add(member);
    if (member.user) {
        // Cache the user in the Bot's users cache
        bot.users.cache.add(member.user);
    }
    bot.events.emit(constants_1.BotEvent.GuildMemberAdd, member);
};
