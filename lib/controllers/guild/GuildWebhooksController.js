"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildWebhooksController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild's webhooks cache.
 * The webhooks are mapped by their IDs
 */
class GuildWebhooksController extends base_1.BaseFetchAllController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Fetches all webhooks in this guild
     * @returns {Promise<Collection<Snowflake | string, Webhook>>}
     */
    async fetchAll() {
        const webhooks = await this.bot.api.fetchGuildWebhooks(this.guild.id);
        this.cache.merge(webhooks);
        return webhooks;
    }
}
exports.GuildWebhooksController = GuildWebhooksController;
