"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionHandlersUtils = void 0;
const HandlersUtils_1 = require("./HandlersUtils");
const structures_1 = require("../../structures");
/**
 * Provides util methods for all reactions-related handlers
 */
class ReactionHandlersUtils extends HandlersUtils_1.HandlersUtils {
    /**
     * Returns the {@link Emoji} received from the event data
     * @type {Emoji}
     */
    get emoji() {
        return new structures_1.Emoji(this.bot, this.data.emoji);
    }
    /**
     * Returns the message extracted from the event data
     * @type {Message | undefined}
     */
    async getMessage() {
        const { channel_id: channelId, message_id: messageId } = this.data;
        const channel = await this.bot.channels.getText(channelId);
        return channel.messages.get(messageId);
    }
}
exports.ReactionHandlersUtils = ReactionHandlersUtils;
