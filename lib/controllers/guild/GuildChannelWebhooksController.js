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
    create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = yield this.bot.api.createWebhook(this.channel.id, options);
            this.cache.add(webhook);
            return webhook;
        });
    }
    /**
     * Fetches all webhooks in this guild channel.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @returns {Promise<Collection<Snowflake, Webhook>>}
     */
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhooks = yield this.bot.api.fetchWebhooks(this.channel.id);
            this.cache.merge(webhooks);
            return webhooks;
        });
    }
    /**
     * Fetches a webhook by its ID
     * @param {Snowflake} id The ID of the webhook
     * @returns {Promise<Webhook>}
     */
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = yield this.bot.api.fetchWebhook(id);
            this.cache.add(webhook);
            return webhook;
        });
    }
    /**
     * Deletes a webhook permanently.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {Snowflake} id The ID of the webhook
     * @returns {Promise<void>}
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.api.deleteWebhook(id);
            this.cache.delete(id);
        });
    }
}
exports.GuildChannelWebhooksController = GuildChannelWebhooksController;
