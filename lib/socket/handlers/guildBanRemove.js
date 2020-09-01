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
const constants_1 = require("../constants");
exports.default = ({ d }, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild_id: guildId, user } = d;
    const guild = yield bot.guilds.get(guildId);
    // Retrieve the ban if cached
    const ban = guild.bans.cache.has(user.id) ? guild.bans.cache.get(user.id) : undefined;
    // Remove the member from the Guild's bans Collection
    guild.bans.cache.delete(user.id);
    bot.events.emit(constants_1.BotEvent.GuildBanRemove, ban);
});
