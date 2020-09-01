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
    fetch(code, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const invite = yield this.bot.api.fetchInvite(code, options);
            this.cache.add(invite);
            return invite;
        });
    }
    /**
     * Fetches all invites (with metadata) in this guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<Collection<string, Invite>>}
     */
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const invites = yield this.bot.api.fetchGuildInvites(this.guild.id);
            this.cache.merge(invites);
            return invites;
        });
    }
}
exports.GuildInvitesController = GuildInvitesController;
