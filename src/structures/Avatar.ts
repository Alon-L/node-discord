import { cdnBaseURL } from '../socket';
import { Snowflake } from '../types';

/**
 * All image formats
 */
const enum Format {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  WebP = 'webp',
  GIF = 'gif',
}

/**
 * The allowed formats for guild emojis (better known as custom emojis)
 */
export const enum GuildEmojiFormat {
  PNG = Format.PNG,
  GIF = Format.GIF,
}

/**
 * The allowed formats for guild icons
 */
export const enum GuildIconFormat {
  JPEG = Format.JPEG,
  JPG = Format.JPG,
  PNG = Format.PNG,
  WebP = Format.WebP,
  GIF = Format.GIF,
}

/**
 * The allowed formats for a guild's splash image
 */
export const enum GuildSplashFormat {
  JPEG = Format.JPEG,
  JPG = Format.JPG,
  PNG = Format.PNG,
  WebP = Format.WebP,
}

/**
 * The allowed formats for a guild's discovery splash image
 */
export const enum GuildDiscoverySplashFormat {
  JPEG = Format.JPEG,
  JPG = Format.JPG,
  PNG = Format.PNG,
  WebP = Format.WebP,
}

/**
 * The allowed formats for a guild's banner image
 */
export const enum GuildBannerFormat {
  JPEG = Format.JPEG,
  JPG = Format.JPG,
  PNG = Format.PNG,
  WebP = Format.WebP,
}

/**
 * The allowed formats for a user's avatar
 */
export const enum UserAvatarFormat {
  JPEG = Format.JPEG,
  JPG = Format.JPG,
  PNG = Format.PNG,
  WebP = Format.WebP,
  GIF = Format.GIF,
}

/**
 * All avatar format enums
 */
export type AvatarFormat =
  | GuildEmojiFormat
  | GuildIconFormat
  | GuildSplashFormat
  | GuildDiscoverySplashFormat
  | GuildBannerFormat
  | UserAvatarFormat;

/**
 * Generates and modifies avatar URLs according to the given arguments
 */
export class Avatar {
  /**
   * Adds the given modifiers to an avatar URL
   * @param {string} url The original avatar URL
   * @param {AvatarFormat} format The required avatar image format
   * @param {number} size The required avatar image size
   * @returns {string}
   */
  private static enhanceURL(url: string, format: AvatarFormat, size?: number): string {
    if (size && (size < 16 || size > 4096 || (size & (size - 1)) !== 0)) {
      throw new Error(
        'You provided an invalid image size! The size must be any power of two between 16 and 4096',
      );
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
  public static emojiURL(
    id: Snowflake,
    format: GuildEmojiFormat = GuildEmojiFormat.PNG,
    size?: number,
  ): string {
    return Avatar.enhanceURL(`${cdnBaseURL}/emojis/${id}`, format, size);
  }

  /**
   * Returns a guild's icon
   * @param {string} hash The guild's icon hash
   * @param {Snowflake} id The ID of the guild
   * @param {GuildIconFormat} format The format of the returned icon image
   * @param {number} size The size of the returned icon image
   * @returns {string}
   */
  public static guildURL(
    hash: string,
    id: Snowflake,
    format: GuildIconFormat = GuildIconFormat.PNG,
    size?: number,
  ): string {
    if (format === GuildIconFormat.GIF && !hash.startsWith('a_')) {
      throw new Error(
        `The icon of guild ${id} is not a GIF as you requested! Choose a different image format`,
      );
    }

    return Avatar.enhanceURL(`${cdnBaseURL}/icons/${id}/${hash}`, format, size);
  }

  /**
   * Returns a guild's splash image URL
   * @param {string} hash The splash hash
   * @param {Snowflake} id The ID of the guild
   * @param {GuildSplashFormat} format The format of the returned splash image
   * @param {number} size The size of the returned splash image
   * @returns {string}
   */
  public static splashURL(
    hash: string,
    id: Snowflake,
    format: GuildSplashFormat = GuildSplashFormat.PNG,
    size?: number,
  ): string {
    return Avatar.enhanceURL(`${cdnBaseURL}/splashes/${id}/${hash}`, format, size);
  }

  /**
   * Returns a guild's discovery splash image URL
   * @param {string} hash The discovery splash hash
   * @param {Snowflake} id The ID of the guild
   * @param {GuildDiscoverySplashFormat} format The format of the returned discovery splash image
   * @param {number} size The size of the returned discovery splash image
   * @returns {string}
   */
  public static discoverySplashURL(
    hash: string,
    id: Snowflake,
    format: GuildDiscoverySplashFormat = GuildDiscoverySplashFormat.PNG,
    size?: number,
  ): string {
    return Avatar.enhanceURL(`${cdnBaseURL}/discovery-splashes/${id}/${hash}`, format, size);
  }

  /**
   * Returns a guild's banner image URL
   * @param {string} hash The banner hash
   * @param {Snowflake} id The ID of the guild
   * @param {GuildBannerFormat} format The format of the returned banner image
   * @param {number} size The size of the returned banner image
   * @returns {string}
   */
  public static bannerURL(
    hash: string,
    id: Snowflake,
    format: GuildBannerFormat = GuildBannerFormat.PNG,
    size?: number,
  ): string {
    return Avatar.enhanceURL(`${cdnBaseURL}/banners/${id}/${hash}`, format, size);
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
  public static userAvatarURL(
    hash: string | null,
    id: Snowflake,
    hashtag: string,
    format: UserAvatarFormat = UserAvatarFormat.PNG,
    size?: number,
  ): string {
    if (format === UserAvatarFormat.GIF && hash && !hash.startsWith('a_')) {
      throw new Error(
        `The avatar of user ${id} is not a GIF as you requested! Choose a different image format`,
      );
    }

    return hash
      ? Avatar.enhanceURL(`${cdnBaseURL}/avatars/${id}/${hash}`, format, size)
      : Avatar.enhanceURL(`${cdnBaseURL}/embed/avatars/${parseInt(hashtag) % 5}`, format, size);
  }
}
