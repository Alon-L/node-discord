"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId, channel_id: channelId } = d;
    const guild = await bot.guilds.get(guildId);
    const channel = await guild.channels.get(channelId);
    bot.events.emit(constants_1.BotEvent.WebhooksUpdate, channel);
};
