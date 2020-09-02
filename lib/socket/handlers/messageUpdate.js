"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { channel_id: channelId, id } = d;
    const channel = await bot.channels.getText(channelId);
    const message = await channel.messages.get(id);
    const { before, after } = message.update(d);
    bot.events.emit(constants_1.BotEvent.MessageUpdate, before, after);
};
