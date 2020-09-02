"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channels_1 = require("../../structures/channels");
const message_1 = require("../../structures/message");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { id, channel_id: channelId } = d;
    const channel = await bot.channels.getText(channelId);
    const guild = channel instanceof channels_1.GuildTextChannel ? channel.guild : undefined;
    const message = channel.messages.cache.get(id) || {
        id,
        guild,
        channel,
    };
    if (message instanceof message_1.Message) {
        // Mark the message as deleted
        message.deleted = true;
    }
    channel.messages.cache.delete(message.id);
    bot.events.emit(constants_1.BotEvent.MessageDelete, message);
};
