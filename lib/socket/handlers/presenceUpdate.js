"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const member_1 = require("../../structures/member");
const constants_1 = require("../constants");
exports.default = ({ d }, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { id: memberId }, guild_id: guildId, } = d;
    const guild = yield bot.guilds.get(guildId);
    const member = yield guild.members.get(memberId);
    const { presence } = member;
    // Manual update due to presence's possibility of being undefined
    const before = presence === null || presence === void 0 ? void 0 : presence.clone();
    const after = (presence === null || presence === void 0 ? void 0 : presence.init(d)) || (member.presence = new member_1.MemberPresence(bot, d, member));
    bot.events.emit(constants_1.BotEvent.PresenceUpdate, before, after);
});
