"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../structures/channels/utils");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const channel = await utils_1.ChannelUtils.create(bot, d);
    utils_1.ChannelUtils.delete(bot, channel);
    bot.events.emit(constants_1.BotEvent.ChannelDelete, channel);
};
