"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const member_1 = require("../../structures/member");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { user: { id: memberId }, guild_id: guildId, } = d;
    const guild = await bot.guilds.get(guildId);
    const member = await guild.members.get(memberId);
    const { presence } = member;
    // Manual update due to presence's possibility of being undefined
    const before = presence === null || presence === void 0 ? void 0 : presence.clone();
    const after = (presence === null || presence === void 0 ? void 0 : presence.init(d)) || (member.presence = new member_1.MemberPresence(bot, d, member));
    bot.events.emit(constants_1.BotEvent.PresenceUpdate, before, after);
};
