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
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const bans = yield this.bot.api.fetchGuildBans(this.guild.id);
            this.cache.merge(bans);
            return bans;
        });
    }
    /**
     * Fetches a guild ban by a user ID
     * @param {Snowflake} id The ID of the user
     * @returns {Promise<GuildBan>}
     */
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ban = yield this.bot.api.fetchGuildBan(this.guild.id, id);
            this.cache.add(ban);
            return ban;
        });
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
