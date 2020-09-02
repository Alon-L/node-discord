"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotUsersController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for the bot's users cache.
 * The users are mapped by their IDs
 */
class BotUsersController extends base_1.BaseFetchController {
    constructor(bot) {
        super(bot);
    }
    /**
     * Fetches the bot user
     * @returns {Promise<BotUser>}
     */
    async fetchBot() {
        const user = await this.bot.api.fetchBotUser();
        this.cache.add(user);
        if (this.bot.user) {
            this.bot.user.update(user.structure);
        }
        else {
            this.bot.user = user;
        }
        return user;
    }
    /**
     * Fetches a user by its ID
     * @param {Snowflake} id The user ID
     * @returns {Promise<User>}
     */
    async fetch(id) {
        const user = await this.bot.api.fetchUser(id);
        this.cache.add(user);
        return user;
    }
}
exports.BotUsersController = BotUsersController;
