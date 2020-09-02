"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildEmoji = void 0;
const Avatar_1 = require("../Avatar");
const Emoji_1 = require("../Emoji");
/**
 * Structure for Emojis that were created in a Guild
 */
class GuildEmoji extends Emoji_1.Emoji {
    constructor(bot, emoji, guild) {
        super(bot, emoji, guild);
    }
    /**
     * Every guild emoji has an identifier
     */
    get id() {
        return this.emojiId;
    }
    /**
     * Returns the guild emoji's URL
     * @param {GuildEmojiFormat} format The format of the returned emoji image
     * @param {number} size The size of the returned emoji image
     * @returns {string}
     */
    URL(format = Avatar_1.GuildEmojiFormat.PNG, size) {
        return Avatar_1.Avatar.emojiURL(this.id, format, size);
    }
    /**
     * Modifies this emoji.
     * Requires the {@link Permission.ManageEmojis} permission
     * @param {ModifyEmojiOptions} options The options for the updated emoji
     * @returns {Promise<GuildEmoji>}
     */
    modify(options) {
        return this.bot.api.modifyGuildEmoji(this.guild.id, this.id, options);
    }
    /**
     * Deletes this emoji.
     * Requires the {@link Permission.ManageEmojis} permission
     * @returns {Promise<void>}
     */
    delete() {
        return this.bot.api.deleteGuildEmoji(this.guild.id, this.id);
    }
    /**
     * @ignore
     * @returns {string}
     */
    toString() {
        return this.animated ? `<a:${this.name}:${this.id}>` : `<:${this.name}:${this.id}>`;
    }
}
exports.GuildEmoji = GuildEmoji;
