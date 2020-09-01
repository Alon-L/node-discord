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
const member_1 = require("../../structures/member");
const constants_1 = require("../constants");
exports.default = ({ d }, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const { channel_id: channelId, timestamp, member } = d;
    const channel = yield bot.channels.getText(channelId);
    // Retrieve user / member from the channel
    const user = channel instanceof channels_1.GuildTextChannel
        ? new member_1.Member(bot, member, channel.guild)
        : channel.recipient;
    bot.events.emit(constants_1.BotEvent.TypingStart, channel, user, timestamp);
});
