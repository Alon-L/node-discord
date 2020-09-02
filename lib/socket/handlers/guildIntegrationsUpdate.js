"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId } = d;
    const guild = await bot.guilds.get(guildId);
    bot.events.emit(constants_1.BotEvent.GuildIntegrationsUpdate, guild);
};
