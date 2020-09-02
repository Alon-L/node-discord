"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.default = async ({ d }, bot) => {
    const handlersUtils = new utils_1.ReactionHandlersUtils(bot, d);
    const { emoji } = handlersUtils;
    const message = await handlersUtils.getMessage();
    const { id } = emoji;
    const reaction = message.reactions.cache.get(id);
    message.reactions.cache.delete(id);
    bot.events.emit(constants_1.BotEvent.MessageReactionRemoveEmoji, reaction);
};
