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
exports.BotGuildsController = void 0;
const base_1 = require("../base");
/**
 * Interface for the bot's guilds cache.
 * The guilds are mapped by their IDs
 */
class BotGuildsController extends base_1.BaseFetchController {
    /**
     * Fetches a guild by its ID and caches it
     * @param {Snowflake} id The ID of the guild
     * @param {FetchGuildOptions} options The additional options for the fetch operation
     * @returns {Promise<Guild>}
     */
    fetch(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = yield this.bot.api.fetchGuild(id, options);
            this.cache.add(guild);
            return guild;
        });
    }
    /**
     * Fetches a guild preview by its guild ID
     * @param {Snowflake} id The ID of the guild
     * @returns {Promise<GuildPreview>}
     */
    fetchPreview(id) {
        return this.bot.api.fetchGuildPreview(id);
    }
}
exports.BotGuildsController = BotGuildsController;
