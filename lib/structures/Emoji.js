"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emoji = void 0;
const User_1 = require("./User");
const base_1 = require("./base");
const Collection_1 = __importDefault(require("../Collection"));
class Emoji extends base_1.BaseStruct {
    constructor(bot, emoji, guild) {
        super(bot, emoji);
        this.guild = guild;
        this.init(emoji);
    }
    /**
     * @ignore
     * @param {GatewayStruct} emoji The emoji data
     * @returns {this}
     */
    init(emoji) {
        var _a;
        this.emojiId = emoji.id;
        this.name = emoji.name;
        this.roles = new Collection_1.default((_a = this.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.filter((_r, id) => emoji.roles.includes(id)));
        if (emoji.user) {
            this.user = new User_1.User(this.bot, emoji.user);
        }
        this.requiresColons = emoji.require_colons;
        this.managed = emoji.managed;
        this.animated = emoji.animated;
        this.available = emoji.available;
        return this;
    }
    /**
     * Returns this emoji's identifier.
     * An emoji identifier could be its name for built-in emojis, or a combination of its name and ID if it's a guild emoji.
     * @returns {string}
     */
    get id() {
        if (this.emojiId)
            return `${this.animated ? 'a:' : ''}${this.name}:${this.emojiId}`;
        return this.name;
    }
    /**
     * Finds the identifier of the given emoji.
     * The emoji can be a Guild emoji, meaning we would have to search for it in the Bot's cached emojis Collection
     * @param {Collection<Snowflake, Emoji>} emojis An emojis cache to search for the emoji in
     * @param {EmojiResolvable} emoji The emoji to resolve
     * @returns {string | null}
     */
    static resolve(emojis, emoji) {
        var _a;
        return emoji instanceof Emoji ? emoji.id : ((_a = emojis.get(emoji)) === null || _a === void 0 ? void 0 : _a.id) || emoji;
    }
}
exports.Emoji = Emoji;
