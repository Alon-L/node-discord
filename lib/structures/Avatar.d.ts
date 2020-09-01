import { Snowflake } from '../types';
/**
 * The base URL for Discord API images
 * https://discord.com/developers/docs/reference#image-formatting-image-base-url
 * @type {string}
 */
export declare const cdnBaseURL = "https://cdn.discordapp.com";
/**
 * The allowed formats for guild emojis (better known as custom emojis)
 */
export declare enum GuildEmojiFormat {
    PNG = "png",
    GIF = "gif"
}
/**
 * The allowed formats for guild icons
 */
export declare enum GuildIconFormat {
    JPEG = "jpeg",
    JPG = "jpg",
    PNG = "png",
    WebP = "webp",
    GIF = "gif"
}
/**
 * The allowed formats for a guild's splash image
 */
export declare enum GuildSplashFormat {
    JPEG = "jpeg",
    JPG = "jpg",
    PNG = "png",
    WebP = "webp"
}
/**
 * The allowed formats for a guild's discovery splash image
 */
export declare enum GuildDiscoverySplashFormat {
    JPEG = "jpeg",
    JPG = "jpg",
    PNG = "png",
    WebP = "webp"
}
/**
 * The allowed formats for a guild's banner image
 */
export declare enum GuildBannerFormat {
    JPEG = "jpeg",
    JPG = "jpg",
    PNG = "png",
    WebP = "webp"
}
/**
 * The allowed formats for a user's avatar
 */
export declare enum UserAvatarFormat {
    JPEG = "jpeg",
    JPG = "jpg",
    PNG = "png",
    WebP = "webp",
    GIF = "gif"
}
/**
 * All avatar format enums
 */
export declare type AvatarFormat = GuildEmojiFormat | GuildIconFormat | GuildSplashFormat | GuildDiscoverySplashFormat | GuildBannerFormat | UserAvatarFormat;
/**
 * Generates and modifies avatar URLs according to the given arguments
 */
export declare class Avatar {
    /**
     * Adds the given modifiers to an avatar URL
     * @param {string} url The original avatar URL
     * @param {AvatarFormat} format The required avatar image format
     * @param {number} size The required avatar image size
     * @returns {string}
     */
    private static enhanceURL;
    /**
     * Returns a guild emoji's image
     * @param {Snowflake} id The ID of the emoji
     * @param {GuildEmojiFormat} format The format of the returned emoji image
     * @param {number} size The size of the returned emoji image
     * @returns {string}
     */
    static emojiURL(id: Snowflake, format?: GuildEmojiFormat, size?: number): string;
    /**
     * Returns a guild's icon
     * @param {string} hash The guild's icon hash
     * @param {Snowflake} id The ID of the guild
     * @param {GuildIconFormat} format The format of the returned icon image
     * @param {number} size The size of the returned icon image
     * @returns {string}
     */
    static guildURL(hash: string, id: Snowflake, format?: GuildIconFormat, size?: number): string;
    /**
     * Returns a guild's splash image URL
     * @param {string} hash The splash hash
     * @param {Snowflake} id The ID of the guild
     * @param {GuildSplashFormat} format The format of the returned splash image
     * @param {number} size The size of the returned splash image
     * @returns {string}
     */
    static splashURL(hash: string, id: Snowflake, format?: GuildSplashFormat, size?: number): string;
    /**
     * Returns a guild's discovery splash image URL
     * @param {string} hash The discovery splash hash
     * @param {Snowflake} id The ID of the guild
     * @param {GuildDiscoverySplashFormat} format The format of the returned discovery splash image
     * @param {number} size The size of the returned discovery splash image
     * @returns {string}
     */
    static discoverySplashURL(hash: string, id: Snowflake, format?: GuildDiscoverySplashFormat, size?: number): string;
    /**
     * Returns a guild's banner image URL
     * @param {string} hash The banner hash
     * @param {Snowflake} id The ID of the guild
     * @param {GuildBannerFormat} format The format of the returned banner image
     * @param {number} size The size of the returned banner image
     * @returns {string}
     */
    static bannerURL(hash: string, id: Snowflake, format?: GuildBannerFormat, size?: number): string;
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
    static userAvatarURL(hash: string | null, id: Snowflake, hashtag: string, format?: UserAvatarFormat, size?: number): string;
}
