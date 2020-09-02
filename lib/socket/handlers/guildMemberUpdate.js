"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId, user } = d;
    const guild = await bot.guilds.get(guildId);
    const member = await guild.members.get(user.id);
    const { before, after } = member.update({
        nick: member.nick,
        joined_at: member.joinedAt.date,
        ...d,
    });
    bot.events.emit(constants_1.BotEvent.GuildMemberUpdate, before, after);
};
