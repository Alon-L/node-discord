"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageReaction = void 0;
const Collection_1 = __importDefault(require("../../Collection"));
const reaction_1 = require("../../controllers/reaction");
const Emoji_1 = require("../Emoji");
const base_1 = require("../base");
/**
 * Holds all users that reacted to a {@link Message} with a specific {@link Emoji}
 */
class MessageReaction extends base_1.BaseStruct {
    constructor(message, reaction) {
        super(message.bot, reaction);
        this.message = message;
        this.users = new reaction_1.ReactionUsersController(this);
        this.members = new Collection_1.default();
        this.emoji = new Emoji_1.Emoji(this.bot, reaction.emoji);
        this.init(reaction);
    }
    /**
     * @ignore
     * @param {GatewayStruct} reaction The reaction data
     * @returns {this}
     */
    init(reaction) {
        this.count = reaction.count || 0;
        this.botReacted = reaction.me;
        this.emoji = new Emoji_1.Emoji(this.bot, reaction.emoji);
        return this;
    }
    /**
     * Deletes all reactions for this emoji.
     * Requires the {@link Permission.ManageMessages} permission
     * @returns {Promise<void>}
     */
    delete() {
        return this.bot.api.removeMessageReactionsEmoji(this.message.channel.id, this.message.id, this.emoji);
    }
    /**
     * The ID of the emoji this reaction stores
     * Serves as an identifier for this reaction
     * @type {string}
     */
    get id() {
        return this.emoji.id;
    }
}
exports.MessageReaction = MessageReaction;
