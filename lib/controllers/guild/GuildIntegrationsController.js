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
exports.GuildIntegrationsController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild's integrations cache.
 * The integrations are mapped by their IDs
 */
class GuildIntegrationsController extends base_1.BaseFetchAllController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Fetches all guild integrations in this guild
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<Collection<Snowflake, GuildIntegration>>}
     */
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const integrations = yield this.bot.api.fetchGuildIntegrations(this.guild.id);
            this.cache.merge(integrations);
            return integrations;
        });
    }
    /**
     * Attaches an integration from the Bot to this guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {CreateIntegrationOptions} options The options for the new integration
     * @returns {Promise<GuildIntegration>}
     */
    create(options) {
        return this.bot.api.createGuildIntegration(this.guild.id, options);
    }
    /**
     * Deletes the attached integration for this guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} id The ID of the guild integration
     * @returns {Promise<void>}
     */
    delete(id) {
        return this.bot.api.deleteGuildIntegration(this.guild.id, id);
    }
}
exports.GuildIntegrationsController = GuildIntegrationsController;
