"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../../controllers");
const guild_1 = require("../../structures/guild");
const constants_1 = require("../constants");
exports.default = ({ d }, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild_id: guildId, emojis } = d;
    const guild = yield bot.guilds.get(guildId);
    const before = guild.emojis.cache;
    const after = new controllers_1.ControllerCache(emojis.map((emoji) => [emoji.id, new guild_1.GuildEmoji(bot, emoji, guild)]));
    guild.emojis.cache = after;
    bot.emojis.merge(guild.emojis.cache);
    bot.events.emit(constants_1.BotEvent.GuildEmojisUpdate, before, after);
});
