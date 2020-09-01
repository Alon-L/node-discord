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
exports.GuildEmojisController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild's emojis cache.
 * The emojis are mapped by their IDs
 */
class GuildEmojisController extends base_1.BaseFetchController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Creates a new guild emoji
     * @param {CreateEmojiOptions} options The options for the new guild emoji
     * @returns {Promise<GuildEmoji>}
     */
    create(options) {
        return this.bot.api.createGuildEmoji(this.guild.id, options);
    }
    /**
     * Fetches a guild emoji by its ID
     * @param {Snowflake} id The ID of the guild emoji
     * @returns {Promise<GuildEmoji>}
     */
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const emoji = yield this.bot.api.fetchGuildEmoji(this.guild.id, id);
            this.cache.add(emoji);
            return emoji;
        });
    }
    /**
     * Fetches all emojis in a guild
     * @returns {Promise<Collection<Snowflake, GuildEmoji>>}
     */
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const emojis = yield this.bot.api.fetchGuildEmojis(this.guild.id);
            this.cache.merge(emojis);
            return emojis;
        });
    }
}
exports.GuildEmojisController = GuildEmojisController;
