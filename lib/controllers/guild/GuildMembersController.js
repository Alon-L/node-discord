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
exports.GuildMembersController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild's members cache.
 * The members are mapped by their IDs
 */
class GuildMembersController extends base_1.BaseFetchController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Fetches a guild member and caches it
     * @param {Snowflake} id The ID of the guild member
     * @returns {Promise<Member>}
     */
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.bot.api.fetchMember(this.guild.id, id);
            this.cache.add(member);
            return member;
        });
    }
    /**
     * Fetches some guild members in this guild and caches them
     * @param {FetchSomeMembersOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Member>>}
     */
    fetchSome(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield this.bot.api.fetchSomeMembers(this.guild.id, options);
            this.cache.merge(members);
            return members;
        });
    }
    /**
     * Removes a user from this guild by its user ID
     * @param {Snowflake} id The ID of the user
     * @returns {Promise<void>}
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bot.api.removeMember(this.guild.id, id);
        });
    }
    /**
     * Returns the bot member in the guild
     * @type {Member | undefined}
     */
    get me() {
        return this.bot.user && this.cache.get(this.bot.user.id);
    }
}
exports.GuildMembersController = GuildMembersController;
