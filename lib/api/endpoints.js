"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = exports.RateLimitHeaders = exports.Endpoints = exports.EndpointRoute = void 0;
/**
 * All Endpoint routes for the Discord API.
 * Every route is appropriate for all HTTP methods that the API supports
 */
var EndpointRoute;
(function (EndpointRoute) {
    EndpointRoute["Channel"] = "/channels/{channel.id}";
    EndpointRoute["ChannelMessage"] = "/channels/{channel.id}/messages/{message.id}";
    EndpointRoute["ChannelMessages"] = "/channels/{channel.id}/messages";
    EndpointRoute["ChannelMessagesReactions"] = "/channels/{channel.id}/messages/{message.id}/reactions";
    EndpointRoute["ChannelMessagesReactionsEmoji"] = "/channels/{channel.id}/messages/{message.id}/reactions/{emoji}";
    EndpointRoute["ChannelMessagesReactionsEmojiUser"] = "/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}";
    EndpointRoute["ChannelMessagesBulkDelete"] = "/channels/{channel.id}/messages/bulk-delete";
    EndpointRoute["ChannelPermissionsOverwrite"] = "/channels/{channel.id}/permissions/{overwrite.id}";
    EndpointRoute["ChannelInvites"] = "/channels/{channel.id}/invites";
    EndpointRoute["ChannelTyping"] = "/channels/{channel.id}/typing";
    EndpointRoute["ChannelPins"] = "/channels/{channel.id}/pins";
    EndpointRoute["ChannelPinsMessage"] = "/channels/{channel.id}/pins/{message.id}";
    EndpointRoute["GuildEmojis"] = "/guilds/{guild.id}/emojis";
    EndpointRoute["GuildEmoji"] = "/guilds/{guild.id}/emojis/{emoji.id}";
    EndpointRoute["Guild"] = "/guilds/{guild.id}";
    EndpointRoute["GuildPreview"] = "/guilds/{guild.id}/preview";
    EndpointRoute["GuildChannels"] = "/guilds/{guild.id}/channels";
    EndpointRoute["GuildMembers"] = "/guilds/{guild.id}/members";
    EndpointRoute["GuildMember"] = "/guilds/{guild.id}/members/{user.id}";
    EndpointRoute["GuildMemberBotNick"] = "/guilds/{guild.id}/members/@me/nick";
    EndpointRoute["GuildMemberRole"] = "/guilds/{guild.id}/members/{user.id}/roles/{role.id}";
    EndpointRoute["GuildBans"] = "/guilds/{guild.id}/bans";
    EndpointRoute["GuildBan"] = "/guilds/{guild.id}/bans/{user.id}";
    EndpointRoute["GuildRoles"] = "/guilds/{guild.id}/roles";
    EndpointRoute["GuildRole"] = "/guilds/{guild.id}/roles/{role.id}";
    EndpointRoute["GuildPrune"] = "/guilds/{guild.id}/prune";
    EndpointRoute["GuildInvites"] = "/guilds/{guild.id}/invites";
    EndpointRoute["GuildIntegrations"] = "/guilds/{guild.id}/integrations";
    EndpointRoute["GuildIntegration"] = "/guilds/{guild.id}/integrations/{integration.id}";
    EndpointRoute["GuildIntegrationSync"] = "/guilds/{guild.id}/integrations/{integration.id}/sync";
    EndpointRoute["GuildWidget"] = "/guilds/{guild.id}/widget";
    EndpointRoute["GuildVanityURL"] = "/guilds/{guild.id}/vanity-url";
    EndpointRoute["UserBot"] = "/users/@me";
    EndpointRoute["User"] = "/users/{user.id}";
    EndpointRoute["UserBotGuilds"] = "/users/@me/guilds";
    EndpointRoute["UserBotGuild"] = "/users/@me/guild/{guild.id}";
    EndpointRoute["UserBotChannels"] = "/users/@me/channels";
    EndpointRoute["Invite"] = "/invites/{invite.code}";
    EndpointRoute["ChannelWebhooks"] = "/channels/{channel.id}/webhooks";
    EndpointRoute["GuildWebhooks"] = "/guilds/{guild.id}/webhooks";
    EndpointRoute["Webhook"] = "/webhooks/{webhook.id}";
})(EndpointRoute = exports.EndpointRoute || (exports.EndpointRoute = {}));
/**
 * All endpoints mapped by their route name
 * @type {Record<EndpointRoute, (...args: string[]) => string>}
 */
exports.Endpoints = {
    [EndpointRoute.Channel]: (channelId) => `/channels/${channelId}`,
    [EndpointRoute.ChannelMessage]: (channelId, messageId) => `/channels/${channelId}/messages/${messageId}`,
    [EndpointRoute.ChannelMessages]: (channelId) => `/channels/${channelId}/messages`,
    [EndpointRoute.ChannelMessagesReactions]: (channelId, messageId) => `/channels/${channelId}/messages/${messageId}/reactions`,
    [EndpointRoute.ChannelMessagesReactionsEmoji]: (channelId, messageId, emoji) => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`,
    [EndpointRoute.ChannelMessagesReactionsEmojiUser]: (channelId, messageId, emoji, userId = '@me') => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`,
    [EndpointRoute.ChannelMessagesBulkDelete]: (channelId) => `/channels/${channelId}/messages/bulk-delete`,
    [EndpointRoute.ChannelPermissionsOverwrite]: (channelId, overwriteId) => `/channels/${channelId}/permissions/${overwriteId}`,
    [EndpointRoute.ChannelInvites]: (channelId) => `/channels/${channelId}/invites`,
    [EndpointRoute.ChannelTyping]: (channelId) => `/channels/${channelId}/typing`,
    [EndpointRoute.ChannelPins]: (channelId) => `/channels/${channelId}/pins`,
    [EndpointRoute.ChannelPinsMessage]: (channelId, messageId) => `/channels/${channelId}/pins/${messageId}`,
    [EndpointRoute.GuildEmojis]: (guildId) => `/guilds/${guildId}/emojis`,
    [EndpointRoute.GuildEmoji]: (guildId, emojiId) => `/guilds/${guildId}/emojis/${emojiId}`,
    [EndpointRoute.Guild]: (guildId) => `/guilds/${guildId}`,
    [EndpointRoute.GuildPreview]: (guildId) => `/guilds/${guildId}/preview`,
    [EndpointRoute.GuildChannels]: (guildId) => `/guilds/${guildId}/channels`,
    [EndpointRoute.GuildMembers]: (guildId) => `/guilds/${guildId}/members`,
    [EndpointRoute.GuildMember]: (guildId, userId) => `/guilds/${guildId}/members/${userId}`,
    [EndpointRoute.GuildMemberBotNick]: (guildId) => `/guilds/${guildId}/members/@me/nick`,
    [EndpointRoute.GuildMemberRole]: (guildId, userId, roleId) => `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    [EndpointRoute.GuildBans]: (guildId) => `/guilds/${guildId}/bans`,
    [EndpointRoute.GuildBan]: (guildId, userId) => `/guilds/${guildId}/bans/${userId}`,
    [EndpointRoute.GuildRoles]: (guildId) => `/guilds/${guildId}/roles`,
    [EndpointRoute.GuildRole]: (guildId, roleId) => `/guilds/${guildId}/roles/${roleId}`,
    [EndpointRoute.GuildPrune]: (guildId) => `/guilds/${guildId}/prune`,
    [EndpointRoute.GuildInvites]: (guildId) => `/guilds/${guildId}/invites`,
    [EndpointRoute.GuildIntegrations]: (guildId) => `/guilds/${guildId}/integrations`,
    [EndpointRoute.GuildIntegration]: (guildId, integrationId) => `/guilds/${guildId}/integrations/${integrationId}`,
    [EndpointRoute.GuildIntegrationSync]: (guildId, integrationId) => `/guilds/${guildId}/integrations/${integrationId}/sync`,
    [EndpointRoute.GuildWidget]: (guildId) => `/guilds/${guildId}/widget`,
    [EndpointRoute.GuildVanityURL]: (guildId) => `/guilds/${guildId}/vanity-url`,
    [EndpointRoute.UserBot]: () => `/users/@me`,
    [EndpointRoute.User]: (userId) => `/users/${userId}`,
    [EndpointRoute.UserBotGuilds]: () => `/users/@me/guilds`,
    [EndpointRoute.UserBotGuild]: (guildId) => `/users/@me/guilds/${guildId}`,
    [EndpointRoute.UserBotChannels]: () => `/users/@me/channels`,
    [EndpointRoute.Invite]: (inviteCode) => `/invites/${inviteCode}`,
    [EndpointRoute.ChannelWebhooks]: (channelId) => `/channels/${channelId}/webhooks`,
    [EndpointRoute.GuildWebhooks]: (guildId) => `/guilds/${guildId}/webhooks`,
    [EndpointRoute.Webhook]: (webhookId) => `/webhooks/${webhookId}`,
};
/**
 * All headers used to identifier the rate limit information of the request
 */
var RateLimitHeaders;
(function (RateLimitHeaders) {
    RateLimitHeaders["Global"] = "x-ratelimit-global";
    RateLimitHeaders["Limit"] = "x-ratelimit-limit";
    RateLimitHeaders["Remaining"] = "x-ratelimit-remaining";
    RateLimitHeaders["Reset"] = "x-ratelimit-reset";
    RateLimitHeaders["ResetAfter"] = "x-ratelimit-reset-after";
    RateLimitHeaders["Bucket"] = "x-ratelimit-bucket";
})(RateLimitHeaders = exports.RateLimitHeaders || (exports.RateLimitHeaders = {}));
/**
 * All status codes that might be returned in response to an API request
 */
var StatusCode;
(function (StatusCode) {
    /**
     * The request was successful
     */
    StatusCode[StatusCode["OK"] = 200] = "OK";
    /**
     * The request was successful and led to the creation of a resource
     */
    StatusCode[StatusCode["Created"] = 201] = "Created";
    /**
     * The request succeeded with no content as response
     * @type {number}
     */
    StatusCode[StatusCode["NoContent"] = 204] = "NoContent";
    /**
     * The token is no longer valid
     */
    StatusCode[StatusCode["UnAuthorized"] = 401] = "UnAuthorized";
    /**
     * The bot has insufficient permissions to send this request
     */
    StatusCode[StatusCode["Forbidden"] = 403] = "Forbidden";
    /**
     * The rate limit has been reached
     */
    StatusCode[StatusCode["TooManyRequests"] = 429] = "TooManyRequests";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
