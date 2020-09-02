"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channels_1 = require("../../structures/channels");
const member_1 = require("../../structures/member");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { channel_id: channelId, timestamp, member } = d;
    const channel = await bot.channels.getText(channelId);
    // Retrieve user / member from the channel
    const user = channel instanceof channels_1.GuildTextChannel
        ? new member_1.Member(bot, member, channel.guild)
        : channel.recipient;
    bot.events.emit(constants_1.BotEvent.TypingStart, channel, user, timestamp);
};
