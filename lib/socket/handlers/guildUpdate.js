"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_1 = require("../../structures/guild");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { id } = d;
    const guild = guild_1.Guild.find(bot, id);
    if (!guild)
        return;
    const { before, after } = guild.update(d);
    bot.events.emit(constants_1.BotEvent.GuildUpdate, before, after);
};
