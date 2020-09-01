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
    fetchBot() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.bot.api.fetchBotUser();
            this.cache.add(user);
            if (this.bot.user) {
                this.bot.user.update(user.structure);
            }
            else {
                this.bot.user = user;
            }
            return user;
        });
    }
    /**
     * Fetches a user by its ID
     * @param {Snowflake} id The user ID
     * @returns {Promise<User>}
     */
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.bot.api.fetchUser(id);
            this.cache.add(user);
            return user;
        });
    }
}
exports.BotUsersController = BotUsersController;
