"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { id } = d;
    const channel = await bot.channels.get(id);
    const { before, after } = channel.update(d);
    bot.events.emit(constants_1.BotEvent.ChannelUpdate, before, after);
};
