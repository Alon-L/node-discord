"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelMessagesController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a text channel's messages cache.
 * The messages are mapped by their IDs
 */
class ChannelMessagesController extends base_1.BaseFetchController {
    constructor(channel) {
        super(channel, channel.bot.options.cache.messagesLimit);
        this.channel = channel;
    }
    /**
     * Deletes a message in the channel
     * @param {Snowflake} id The ID of the message you wish to delete
     * @returns {Promise<Message>}
     */
    delete(id) {
        return this.bot.api.deleteMessage(this.channel.id, id);
    }
    /**
     * Fetches and caches a message in the channel
     * @param {Snowflake} id The ID of the message you wish to fetch
     * @returns {Promise<Message>}
     */
    async fetch(id) {
        const message = await this.bot.api.fetchMessage(this.channel.id, id);
        this.cache.add(message);
        return message;
    }
    /**
     * Fetches and caches some messages in the channel
     * @param {FetchSomeMessagesOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Message>>}
     */
    async fetchSome(options) {
        const messages = await this.bot.api.fetchSomeMessages(this.channel.id, options);
        this.cache.merge(messages);
        return messages;
    }
}
exports.ChannelMessagesController = ChannelMessagesController;
