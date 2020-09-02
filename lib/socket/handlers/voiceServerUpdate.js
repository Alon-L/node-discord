"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
exports.default = async ({ d }, bot) => {
    bot.events.emit(__1.BotEvent.VoiceServerUpdate, bot.guilds.cache.get(d.guild_id), d);
};
