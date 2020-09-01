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
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const invites = yield this.bot.api.fetchChannelInvites(this.channel.id);
            this.cache.merge(invites);
            return invites;
        });
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
