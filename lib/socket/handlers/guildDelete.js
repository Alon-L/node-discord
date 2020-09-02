"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_1 = require("../../structures/guild");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { unavailable, id } = d;
    const guild = unavailable ? new guild_1.GuildUnavailable(bot, d) : await bot.guilds.get(id);
    guild_1.Guild.delete(bot, guild);
    bot.events.emit(constants_1.BotEvent.GuildDelete, guild);
};
