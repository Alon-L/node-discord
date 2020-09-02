"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildInvitesController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild's invites cache
 * The invites are mapped by their invite codes
 */
class GuildInvitesController extends base_1.BaseFetchController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Delete an invite by its invite code
     * @param {Snowflake} code The invite code
     * @returns {Promise<Invite>}
     */
    delete(code) {
        return this.bot.api.deleteInvite(code);
    }
    /**
     * Fetches an invite by its invite code
     * @param {string} code The invite code
     * @param {FetchInviteOptions} options An additional set of options for the invite
     * @returns {Promise<Invite>}
     */
    async fetch(code, options) {
        const invite = await this.bot.api.fetchInvite(code, options);
        this.cache.add(invite);
        return invite;
    }
    /**
     * Fetches all invites (with metadata) in this guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<Collection<string, Invite>>}
     */
    async fetchAll() {
        const invites = await this.bot.api.fetchGuildInvites(this.guild.id);
        this.cache.merge(invites);
        return invites;
    }
}
exports.GuildInvitesController = GuildInvitesController;
