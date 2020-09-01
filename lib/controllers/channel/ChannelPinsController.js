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
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const pins = yield this.bot.api.fetchChannelPins(this.channel.id);
            this.cache.merge(pins);
            return pins;
        });
    }
    /**
     * Pins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} id The ID of the message
     * @returns {Promise<void>}
     */
    pin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.api.pinMessage(this.channel.id, id);
            // Cache the pinned message
            const message = yield this.channel.messages.get(id);
            this.cache.add(message);
        });
    }
    /**
     * Unpins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} id The ID of the message
     * @returns {Promise<void>}
     */
    unpin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.api.unpinMessage(this.channel.id, id);
            // Remove the unpinned message from the cache
            this.cache.delete(id);
        });
    }
}
exports.ChannelPinsController = ChannelPinsController;
