"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../../structures/message");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { channel_id: channelId } = d;
    const channel = await bot.channels.getText(channelId);
    const message = new message_1.Message(bot, d, channel);
    // Add the message to the cache
    channel.messages.cache.add(message);
    // Set the last message ID of the channel to that message
    channel.lastMessageId = message.id;
    bot.events.emit(constants_1.BotEvent.MessageCreate, message);
};
