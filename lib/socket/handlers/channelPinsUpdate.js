"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { channel_id: channelId, last_pin_timestamp: lastPinTimestamp } = d;
    const channel = await bot.channels.getText(channelId);
    const oldPinTimestamp = channel.pins.lastPinTimestamp;
    channel.pins.lastPinTimestamp = new structures_1.Timestamp(lastPinTimestamp);
    bot.events.emit(constants_1.BotEvent.ChannelPinsUpdate, channel, oldPinTimestamp);
};
