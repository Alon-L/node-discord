"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../../structures/message");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { ids, channel_id: channelId } = d;
    const channel = await bot.channels.getText(channelId);
    // Use the Message class if the message is cached, otherwise use the message ID
    const messages = ids.map((id) => channel.messages.cache.get(id) || id);
    for (const message of messages) {
        if (message instanceof message_1.Message) {
            // Mark message as deleted
            message.deleted = true;
        }
    }
    bot.events.emit(constants_1.BotEvent.MessageDeleteBulk, channel, messages);
};
