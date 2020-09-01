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
const channels_1 = require("../../structures/channels");
const constants_1 = require("../constants");
exports.default = ({ d }, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild_id: guildId, channel_id: channelId, code } = d;
    const guild = yield bot.guilds.get(guildId);
    const channel = yield bot.channels.get(channelId);
    const invite = (guild === null || guild === void 0 ? void 0 : guild.invites.cache.get(code)) || {
        channelId: channelId,
        guild,
        code,
    };
    // Delete the invite from the guild's invites cache
    guild === null || guild === void 0 ? void 0 : guild.invites.cache.delete(code);
    if (channel instanceof channels_1.GuildChannel) {
        // Delete the invite from the guild channel's invites cache
        channel.invites.cache.delete(invite.code);
    }
    bot.events.emit(constants_1.BotEvent.InviteDelete, invite);
});
