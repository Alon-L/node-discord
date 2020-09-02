"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
const constants_1 = require("../constants");
exports.default = ({ d }, bot) => {
    var _a, _b;
    const invite = new structures_1.Invite(bot, d);
    // Add the invite to the guild's invites cache
    (_a = invite.guild) === null || _a === void 0 ? void 0 : _a.invites.cache.add(invite);
    // Add the invite to the guild channel's invites cache
    (_b = invite.channel) === null || _b === void 0 ? void 0 : _b.invites.cache.add(invite);
    bot.events.emit(constants_1.BotEvent.InviteCreate, invite);
};
