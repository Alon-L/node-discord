"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildBansController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild's bans cache.
 * The bans are mapped by their banned user IDs
 */
class GuildBansController extends base_1.BaseFetchController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Fetches all bans in the guilds
     * @returns {Promise<Collection<Snowflake, GuildBan>>}
     */
    async fetchAll() {
        const bans = await this.bot.api.fetchGuildBans(this.guild.id);
        this.cache.merge(bans);
        return bans;
    }
    /**
     * Fetches a guild ban by a user ID
     * @param {Snowflake} id The ID of the user
     * @returns {Promise<GuildBan>}
     */
    async fetch(id) {
        const ban = await this.bot.api.fetchGuildBan(this.guild.id, id);
        this.cache.add(ban);
        return ban;
    }
    /**
     * Unbans a member from the guild.
     * Requires the {@link Permission.BanMembers} permission
     * @param {Snowflake} id The ID of the member
     * @returns {Promise<void>}
     */
    delete(id) {
        return this.bot.api.unbanMember(this.guild.id, id);
    }
}
exports.GuildBansController = GuildBansController;
