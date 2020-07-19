import { Snowflake } from '../types/types';

/**
 * All Endpoint routes for the Discord API.
 * Every route is appropriate for all HTTP methods that the API supports
 */
export const enum EndpointRoute {
  Channel = 'CHANNEL',
  ChannelMessage = 'CHANNEL_MESSAGE',
  ChannelMessages = 'CHANNEL_MESSAGES',
  ChannelMessageReaction = 'CHANNEL_MESSAGE_REACTION',
  ChannelMessageReactionEmoji = 'CHANNEL_MESSAGE_REACTION_EMOJI',
  ChannelMessageReactionEmojiUser = 'CHANNEL_MESSAGE_REACTION_EMOJI_USER',
  ChannelMessagesBulkDelete = 'CHANNEL_MESSAGES_BULK_DELETE',
  ChannelPermissionsOverwrite = 'CHANNEL_PERMISSIONS_OVERWRITE',
  ChannelInvites = 'CHANNEL_INVITES',
}

/**
 * All HTTP methods the API supports
 */
export const enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

/**
 * All endpoints mapped by their route name
 * @type {Record<EndpointRoute, (...args: string[]) => string>}
 */
export const Endpoints: Record<EndpointRoute, (...args: string[]) => string> = {
  [EndpointRoute.Channel]: (channelId: Snowflake) => `/channels/${channelId}`,
  [EndpointRoute.ChannelMessage]: (channelId: Snowflake, messageId: Snowflake) =>
    `/channels/${channelId}/messages/${messageId}`,
  [EndpointRoute.ChannelMessages]: (channelId: Snowflake) => `/channels/${channelId}/messages`,
  [EndpointRoute.ChannelMessageReaction]: (channelId: Snowflake, messageId: Snowflake) =>
    `/channels/${channelId}/messages/${messageId}/reactions`,
  [EndpointRoute.ChannelMessageReactionEmoji]: (
    channelId: Snowflake,
    messageId: Snowflake,
    emoji: string,
  ) => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`,
  [EndpointRoute.ChannelMessageReactionEmojiUser]: (
    channelId: Snowflake,
    messageId: Snowflake,
    emoji: string,
    userId: Snowflake = '@me',
  ) => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`,
  [EndpointRoute.ChannelMessagesBulkDelete]: (channelId: Snowflake) =>
    `/channels/${channelId}/messages/bulk-delete`,
  [EndpointRoute.ChannelPermissionsOverwrite]: (channelId: Snowflake, overwriteId: Snowflake) =>
    `/channels/${channelId}/permissions/${overwriteId}`,
  [EndpointRoute.ChannelInvites]: (channelId: Snowflake) => `/channels/${channelId}/invites`,
};

/**
 * All headers used to identifier the rate limit information of the request
 */
export const enum RateLimitHeaders {
  Global = 'x-ratelimit-global',
  Limit = 'x-ratelimit-limit',
  Remaining = 'x-ratelimit-remaining',
  Reset = 'x-ratelimit-reset',
  ResetAfter = 'x-ratelimit-reset-after',
  Bucket = 'x-ratelimit-bucket',
}

/**
 * All status codes that might be returned in response to an API request
 */
export const enum StatusCode {
  /**
   * The request was successful
   * @type {number}
   */
  OK = 200,

  /**
   * The request succeeded with no content as response
   * @type {number}
   */
  NoContent = 204,

  /**
   * The token is no longer valid
   * @type {number}
   */
  UnAuthorized = 401,

  /**
   * The bot has insufficient permissions to send this request
   * @type {number}
   */
  Forbidden = 403,

  /**
   * The rate limit has been reached
   * @type {number}
   */
  TooManyRequests = 429,
}

export const ValidCodes: StatusCode[] = [StatusCode.OK, StatusCode.NoContent];
