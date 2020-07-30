import { Snowflake } from '../types/types';

/**
 * All Endpoint routes for the Discord API.
 * Every route is appropriate for all HTTP methods that the API supports
 */
export const enum EndpointRoute {
  Channel = '/channels/{channel.id}',
  ChannelMessage = '/channels/{channel.id}/messages/{message.id}',
  ChannelMessages = '/channels/{channel.id}/messages',
  ChannelMessagesReactions = '/channels/{channel.id}/messages/{message.id}/reactions',
  ChannelMessagesReactionsEmoji = '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}',
  ChannelMessagesReactionsEmojiUser = '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}',
  ChannelMessagesBulkDelete = '/channels/{channel.id}/messages/bulk-delete',
  ChannelPermissionsOverwrite = '/channels/{channel.id}/permissions/{overwrite.id}',
  ChannelInvites = '/channels/{channel.id}/invites',
  ChannelTyping = '/channels/{channel.id}/typing',
  ChannelPins = '/channels/{channel.id}/pins',
  ChannelPinsMessage = '/channels/{channel.id}/pins/{message.id}',
  GuildEmojis = '/guilds/{guild.id}/emojis',
  GuildEmoji = '/guilds/{guild.id}/emojis/{emoji.id}',
  Guild = '/guilds/{guild.id}',
  GuildPreview = '/guilds/{guild.id}/preview',
  GuildChannels = '/guilds/{guild.id}/channels',
  Invite = '/invites/{invite.code}',
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
  [EndpointRoute.ChannelMessagesReactions]: (channelId: Snowflake, messageId: Snowflake) =>
    `/channels/${channelId}/messages/${messageId}/reactions`,
  [EndpointRoute.ChannelMessagesReactionsEmoji]: (
    channelId: Snowflake,
    messageId: Snowflake,
    emoji: string,
  ) => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`,
  [EndpointRoute.ChannelMessagesReactionsEmojiUser]: (
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
  [EndpointRoute.ChannelTyping]: (channelId: Snowflake) => `/channels/${channelId}/typing`,
  [EndpointRoute.ChannelPins]: (channelId: Snowflake) => `/channels/${channelId}/pins`,
  [EndpointRoute.ChannelPinsMessage]: (channelId: Snowflake, messageId: Snowflake) =>
    `/channels/${channelId}/pins/${messageId}`,
  [EndpointRoute.GuildEmojis]: (guildId: Snowflake) => `/guilds/${guildId}/emojis`,
  [EndpointRoute.GuildEmoji]: (guildId: Snowflake, emojiId: Snowflake) =>
    `/guilds/${guildId}/emojis/${emojiId}`,
  [EndpointRoute.Guild]: (guildId: Snowflake) => `/guilds/${guildId}`,
  [EndpointRoute.GuildPreview]: (guildId: Snowflake) => `/guilds/${guildId}/preview`,
  [EndpointRoute.GuildChannels]: (guildId: Snowflake) => `/guilds/${guildId}/channels`,
  [EndpointRoute.Invite]: (inviteCode: string) => `/invites/${inviteCode}`,
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
