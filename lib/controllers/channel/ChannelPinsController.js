"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelPinsController = void 0;
const base_1 = require("../base");
/**
 * Interface for a text channel's pinned messages cache.
 * The pinned messages are mapped by their IDs
 */
class ChannelPinsController extends base_1.BaseFetchAllController {
    constructor(channel) {
        super(channel);
        this.channel = channel;
    }
    /**
     * Fetches all messages in the text channel and caches them
     * @returns {Promise<Collection<Snowflake, Message>>}
     */
    async fetchAll() {
        const pins = await this.bot.api.fetchChannelPins(this.channel.id);
        this.cache.merge(pins);
        return pins;
    }
    /**
     * Pins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} id The ID of the message
     * @returns {Promise<void>}
     */
    async pin(id) {
        await this.bot.api.pinMessage(this.channel.id, id);
        // Cache the pinned message
        const message = await this.channel.messages.get(id);
        this.cache.add(message);
    }
    /**
     * Unpins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} id The ID of the message
     * @returns {Promise<void>}
     */
    async unpin(id) {
        await this.bot.api.unpinMessage(this.channel.id, id);
        // Remove the unpinned message from the cache
        this.cache.delete(id);
    }
}
exports.ChannelPinsController = ChannelPinsController;
