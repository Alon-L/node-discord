"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageReactionsController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a message's reactions cache.
 * The reactions are mapped by the emoji name or emoji ID
 */
class MessageReactionsController extends base_1.BaseDeleteController {
    constructor(message) {
        super(message);
        this.message = message;
    }
    /**
     * Deletes a reaction a user reacted with.
     * If no `userId` argument was provided, the Bot will remove its own reaction.
     * @param {EmojiResolvable} emoji The emoji to remove from the message
     * @param {Snowflake} userId The ID of the user of which reaction should be removed
     * @returns {Promise<void>}
     */
    delete(emoji, userId = '@me') {
        return this.bot.api.removeMessageReaction(this.message.channel.id, this.message.id, emoji, userId);
    }
    /**
     * Deletes all reactions for an emoji.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {EmojiResolvable} emoji The reaction emoji you wish to delete
     * @returns {Promise<void>}
     */
    deleteEmoji(emoji) {
        return this.bot.api.removeMessageReactionsEmoji(this.message.channel.id, this.message.id, emoji);
    }
    /**
     * Removes all reactions on the message associated to this controller.
     * Requires the {@link Permission.ManageMessages} permission to be present on the Bot
     * @returns {Promise<void>}
     */
    deleteAll() {
        return this.bot.api.removeMessageReactions(this.message.channel.id, this.message.id);
    }
}
exports.MessageReactionsController = MessageReactionsController;
