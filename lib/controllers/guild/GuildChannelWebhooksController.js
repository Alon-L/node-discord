"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildChannelWebhooksController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild channel's webhooks cache.
 * The webhooks are mapped by their IDs
 */
class GuildChannelWebhooksController extends base_1.BaseFetchController {
    constructor(channel) {
        super(channel);
        this.channel = channel;
    }
    /**
     * Creates a new webhook for this guild channel.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {CreateWebhookOptions} options The options for the new webhook
     * @returns {Promise<Webhook>}
     */
    async create(options) {
        const webhook = await this.bot.api.createWebhook(this.channel.id, options);
        this.cache.add(webhook);
        return webhook;
    }
    /**
     * Fetches all webhooks in this guild channel.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @returns {Promise<Collection<Snowflake, Webhook>>}
     */
    async fetchAll() {
        const webhooks = await this.bot.api.fetchWebhooks(this.channel.id);
        this.cache.merge(webhooks);
        return webhooks;
    }
    /**
     * Fetches a webhook by its ID
     * @param {Snowflake} id The ID of the webhook
     * @returns {Promise<Webhook>}
     */
    async fetch(id) {
        const webhook = await this.bot.api.fetchWebhook(id);
        this.cache.add(webhook);
        return webhook;
    }
    /**
     * Deletes a webhook permanently.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {Snowflake} id The ID of the webhook
     * @returns {Promise<void>}
     */
    async delete(id) {
        await this.bot.api.deleteWebhook(id);
        this.cache.delete(id);
    }
}
exports.GuildChannelWebhooksController = GuildChannelWebhooksController;
