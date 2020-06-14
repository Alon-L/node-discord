import { AvatarFormat } from '../socket/constants';
import { cdnBaseURL } from '../socket/properties';
import { Snowflake } from '../types/types';

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
  static enhanceURL(url: string, format: AvatarFormat, size?: number): string {
    if (size && (size < 16 || size > 4096 || (size & (size - 1)) !== 0)) {
      throw new Error(
        'You provided an invalid image size! The size must be any power of two between 16 and 4096',
      );
    }

    const avatarURL = `${url}.${format}`;
    return size ? `${avatarURL}?size=${size}` : avatarURL;
  }

  /**
   * Returns a user's avatar URL. Returns the default user avatar if the user does not have an avatar.
   * *Note: the default user avatar only supports type {@link AvatarFormat.PNG}*
   * @param {string | null} hash The user's avatar hash
   * @param {Snowflake} id The user's ID
   * @param {number} hashtag the user's hashtag
   * @param {AvatarFormat} format The avatar image format
   * @param {number} size The avatar image size
   * @returns {string}
   */
  public static userURL(
    hash: string | null,
    id: Snowflake,
    hashtag: string,
    format: AvatarFormat = AvatarFormat.PNG,
    size?: number,
  ): string {
    if (format === AvatarFormat.GIF && hash && !hash.startsWith('a_')) {
      throw new Error(
        `The avatar of user ${id} is not a GIF as you requested! Choose a different image extension`,
      );
    }

    return hash
      ? Avatar.enhanceURL(`${cdnBaseURL}/avatars/${id}/${hash}`, format, size)
      : Avatar.enhanceURL(`${cdnBaseURL}/embed/avatars/${parseInt(hashtag) % 5}`, format, size);
  }
}

export default Avatar;
