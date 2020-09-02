"use strict";
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
    async fetch(id) {
        const member = await this.bot.api.fetchMember(this.guild.id, id);
        this.cache.add(member);
        return member;
    }
    /**
     * Fetches some guild members in this guild and caches them
     * @param {FetchSomeMembersOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Member>>}
     */
    async fetchSome(options) {
        const members = await this.bot.api.fetchSomeMembers(this.guild.id, options);
        this.cache.merge(members);
        return members;
    }
    /**
     * Removes a user from this guild by its user ID
     * @param {Snowflake} id The ID of the user
     * @returns {Promise<void>}
     */
    async remove(id) {
        return this.bot.api.removeMember(this.guild.id, id);
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
