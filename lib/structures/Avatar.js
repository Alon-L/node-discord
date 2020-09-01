"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = exports.UserAvatarFormat = exports.GuildBannerFormat = exports.GuildDiscoverySplashFormat = exports.GuildSplashFormat = exports.GuildIconFormat = exports.GuildEmojiFormat = exports.cdnBaseURL = void 0;
/**
 * The base URL for Discord API images
 * https://discord.com/developers/docs/reference#image-formatting-image-base-url
 * @type {string}
 */
exports.cdnBaseURL = 'https://cdn.discordapp.com';
/**
 * The allowed formats for guild emojis (better known as custom emojis)
 */
var GuildEmojiFormat;
(function (GuildEmojiFormat) {
    GuildEmojiFormat["PNG"] = "png";
    GuildEmojiFormat["GIF"] = "gif";
})(GuildEmojiFormat = exports.GuildEmojiFormat || (exports.GuildEmojiFormat = {}));
/**
 * The allowed formats for guild icons
 */
var GuildIconFormat;
(function (GuildIconFormat) {
    GuildIconFormat["JPEG"] = "jpeg";
    GuildIconFormat["JPG"] = "jpg";
    GuildIconFormat["PNG"] = "png";
    GuildIconFormat["WebP"] = "webp";
    GuildIconFormat["GIF"] = "gif";
})(GuildIconFormat = exports.GuildIconFormat || (exports.GuildIconFormat = {}));
/**
 * The allowed formats for a guild's splash image
 */
var GuildSplashFormat;
(function (GuildSplashFormat) {
    GuildSplashFormat["JPEG"] = "jpeg";
    GuildSplashFormat["JPG"] = "jpg";
    GuildSplashFormat["PNG"] = "png";
    GuildSplashFormat["WebP"] = "webp";
})(GuildSplashFormat = exports.GuildSplashFormat || (exports.GuildSplashFormat = {}));
/**
 * The allowed formats for a guild's discovery splash image
 */
var GuildDiscoverySplashFormat;
(function (GuildDiscoverySplashFormat) {
    GuildDiscoverySplashFormat["JPEG"] = "jpeg";
    GuildDiscoverySplashFormat["JPG"] = "jpg";
    GuildDiscoverySplashFormat["PNG"] = "png";
    GuildDiscoverySplashFormat["WebP"] = "webp";
})(GuildDiscoverySplashFormat = exports.GuildDiscoverySplashFormat || (exports.GuildDiscoverySplashFormat = {}));
/**
 * The allowed formats for a guild's banner image
 */
var GuildBannerFormat;
(function (GuildBannerFormat) {
    GuildBannerFormat["JPEG"] = "jpeg";
    GuildBannerFormat["JPG"] = "jpg";
    GuildBannerFormat["PNG"] = "png";
    GuildBannerFormat["WebP"] = "webp";
})(GuildBannerFormat = exports.GuildBannerFormat || (exports.GuildBannerFormat = {}));
/**
 * The allowed formats for a user's avatar
 */
var UserAvatarFormat;
(function (UserAvatarFormat) {
    UserAvatarFormat["JPEG"] = "jpeg";
    UserAvatarFormat["JPG"] = "jpg";
    UserAvatarFormat["PNG"] = "png";
    UserAvatarFormat["WebP"] = "webp";
    UserAvatarFormat["GIF"] = "gif";
})(UserAvatarFormat = exports.UserAvatarFormat || (exports.UserAvatarFormat = {}));
/**
 * Generates and modifies avatar URLs according to the given arguments
 */
class Avatar {
    /**
     * Adds the given modifiers to an avatar URL
     * @param {string} url The original avatar URL
     * @param {AvatarFormat} format The required avatar image format
     * @param {number} size The required avatar image size
     * @returns {string}
     */
    static enhanceURL(url, format, size) {
        if (size && (size < 16 || size > 4096 || (size & (size - 1)) !== 0)) {
            throw new Error('You provided an invalid image size! The size must be any power of two between 16 and 4096');
        }
        const avatarURL = `${url}.${format}`;
        return size ? `${avatarURL}?size=${size}` : avatarURL;
    }
    /**
     * Returns a guild emoji's image
     * @param {Snowflake} id The ID of the emoji
     * @param {GuildEmojiFormat} format The format of the returned emoji image
     * @param {number} size The size of the returned emoji image
     * @returns {string}
     */
    static emojiURL(id, format = GuildEmojiFormat.PNG, size) {
        return Avatar.enhanceURL(`${exports.cdnBaseURL}/emojis/${id}`, format, size);
    }
    /**
     * Returns a guild's icon
     * @param {string} hash The guild's icon hash
     * @param {Snowflake} id The ID of the guild
     * @param {GuildIconFormat} format The format of the returned icon image
     * @param {number} size The size of the returned icon image
     * @returns {string}
     */
    static guildURL(hash, id, format = GuildIconFormat.PNG, size) {
        if (format === GuildIconFormat.GIF && !hash.startsWith('a_')) {
            throw new Error(`The icon of guild ${id} is not a GIF as you requested! Choose a different image format`);
        }
        return Avatar.enhanceURL(`${exports.cdnBaseURL}/icons/${id}/${hash}`, format, size);
    }
    /**
     * Returns a guild's splash image URL
     * @param {string} hash The splash hash
     * @param {Snowflake} id The ID of the guild
     * @param {GuildSplashFormat} format The format of the returned splash image
     * @param {number} size The size of the returned splash image
     * @returns {string}
     */
    static splashURL(hash, id, format = GuildSplashFormat.PNG, size) {
        return Avatar.enhanceURL(`${exports.cdnBaseURL}/splashes/${id}/${hash}`, format, size);
    }
    /**
     * Returns a guild's discovery splash image URL
     * @param {string} hash The discovery splash hash
     * @param {Snowflake} id The ID of the guild
     * @param {GuildDiscoverySplashFormat} format The format of the returned discovery splash image
     * @param {number} size The size of the returned discovery splash image
     * @returns {string}
     */
    static discoverySplashURL(hash, id, format = GuildDiscoverySplashFormat.PNG, size) {
        return Avatar.enhanceURL(`${exports.cdnBaseURL}/discovery-splashes/${id}/${hash}`, format, size);
    }
    /**
     * Returns a guild's banner image URL
     * @param {string} hash The banner hash
     * @param {Snowflake} id The ID of the guild
     * @param {GuildBannerFormat} format The format of the returned banner image
     * @param {number} size The size of the returned banner image
     * @returns {string}
     */
    static bannerURL(hash, id, format = GuildBannerFormat.PNG, size) {
        return Avatar.enhanceURL(`${exports.cdnBaseURL}/banners/${id}/${hash}`, format, size);
    }
    /**
     * Returns a user's avatar URL. Returns the default user avatar if the user does not have an avatar.
     * *Note: the default user avatar only supports type {@link Format.PNG}*
     * @param {string | null} hash The user's avatar hash
     * @param {Snowflake} id The user's ID
     * @param {number} hashtag the user's hashtag
     * @param {UserAvatarFormat} format The avatar image format
     * @param {number} size The avatar image size
     * @returns {string}
     */
    static userAvatarURL(hash, id, hashtag, format = UserAvatarFormat.PNG, size) {
        if (format === UserAvatarFormat.GIF && hash && !hash.startsWith('a_')) {
            throw new Error(`The avatar of user ${id} is not a GIF as you requested! Choose a different image format`);
        }
        return hash
            ? Avatar.enhanceURL(`${exports.cdnBaseURL}/avatars/${id}/${hash}`, format, size)
            : Avatar.enhanceURL(`${exports.cdnBaseURL}/embed/avatars/${parseInt(hashtag) % 5}`, format, size);
    }
}
exports.Avatar = Avatar;
