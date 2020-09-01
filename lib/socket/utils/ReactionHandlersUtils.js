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
    getMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel_id: channelId, message_id: messageId } = this.data;
            const channel = yield this.bot.channels.getText(channelId);
            return channel.messages.get(messageId);
        });
    }
}
exports.ReactionHandlersUtils = ReactionHandlersUtils;
