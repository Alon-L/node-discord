import { Snowflake } from '../types/types';

/**
 * All Endpoint routes for the Discord API.
 * Every route is appropriate for all HTTP methods that the API supports
 */
export const enum EndpointRoute {
  Channel = 'CHANNEL',
  ChannelMessages = 'CHANNEL_MESSAGES',
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
  [EndpointRoute.ChannelMessages]: (channelId: Snowflake) => `/channels/${channelId}/messages`,
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
 * All error status codes that might be returned in response to an API request
 */
export const enum ErrorStatusCodes {
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
