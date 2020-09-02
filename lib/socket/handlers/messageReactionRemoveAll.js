"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.default = async ({ d }, bot) => {
    const handlersUtils = new utils_1.ReactionHandlersUtils(bot, d);
    const message = await handlersUtils.getMessage();
    message.reactions.cache.clear();
    bot.events.emit(constants_1.BotEvent.MessageReactionRemoveAll, message);
};
