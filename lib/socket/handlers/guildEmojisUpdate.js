"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../../controllers");
const guild_1 = require("../../structures/guild");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId, emojis } = d;
    const guild = await bot.guilds.get(guildId);
    const before = guild.emojis.cache;
    const after = new controllers_1.ControllerCache(emojis.map((emoji) => [emoji.id, new guild_1.GuildEmoji(bot, emoji, guild)]));
    guild.emojis.cache = after;
    bot.emojis.merge(guild.emojis.cache);
    bot.events.emit(constants_1.BotEvent.GuildEmojisUpdate, before, after);
};
