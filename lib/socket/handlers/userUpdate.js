"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { id } = d;
    const user = bot.users.cache.get(id);
    if (!user)
        return;
    const { before, after } = user.update(d);
    bot.events.emit(constants_1.BotEvent.UserUpdate, before, after);
};
