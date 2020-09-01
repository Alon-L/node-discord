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
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.bot.api.fetchMessage(this.channel.id, id);
            this.cache.add(message);
            return message;
        });
    }
    /**
     * Fetches and caches some messages in the channel
     * @param {FetchSomeMessagesOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Message>>}
     */
    fetchSome(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.bot.api.fetchSomeMessages(this.channel.id, options);
            this.cache.merge(messages);
            return messages;
        });
    }
}
exports.ChannelMessagesController = ChannelMessagesController;
