"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildChannelInvitesController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild channel's invites cache.
 * The invites are mapped by their invite codes
 */
class GuildChannelInvitesController extends base_1.BaseFetchAllController {
    constructor(channel) {
        super(channel);
        this.channel = channel;
    }
    /**
     * Fetches all invites for this channel.
     * Requires the {@link Permission.ManageChannels} permission
     * @returns {Promise<Collection<string, Invite>>}
     */
    async fetchAll() {
        const invites = await this.bot.api.fetchChannelInvites(this.channel.id);
        this.cache.merge(invites);
        return invites;
    }
    /**
     * Creates a new invite for a guild channel.
     * Requires the {@link Permission.CreateInstantInvite} permission
     * @param {InviteOptions} options The new invite options
     * @returns {Promise<Invite>}
     */
    create(options) {
        return this.bot.api.createChannelInvite(this.channel.id, options);
    }
}
exports.GuildChannelInvitesController = GuildChannelInvitesController;
