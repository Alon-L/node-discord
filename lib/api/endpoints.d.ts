/**
 * All Endpoint routes for the Discord API.
 * Every route is appropriate for all HTTP methods that the API supports
 */
export declare enum EndpointRoute {
    Channel = "/channels/{channel.id}",
    ChannelMessage = "/channels/{channel.id}/messages/{message.id}",
    ChannelMessages = "/channels/{channel.id}/messages",
    ChannelMessagesReactions = "/channels/{channel.id}/messages/{message.id}/reactions",
    ChannelMessagesReactionsEmoji = "/channels/{channel.id}/messages/{message.id}/reactions/{emoji}",
    ChannelMessagesReactionsEmojiUser = "/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}",
    ChannelMessagesBulkDelete = "/channels/{channel.id}/messages/bulk-delete",
    ChannelPermissionsOverwrite = "/channels/{channel.id}/permissions/{overwrite.id}",
    ChannelInvites = "/channels/{channel.id}/invites",
    ChannelTyping = "/channels/{channel.id}/typing",
    ChannelPins = "/channels/{channel.id}/pins",
    ChannelPinsMessage = "/channels/{channel.id}/pins/{message.id}",
    GuildEmojis = "/guilds/{guild.id}/emojis",
    GuildEmoji = "/guilds/{guild.id}/emojis/{emoji.id}",
    Guild = "/guilds/{guild.id}",
    GuildPreview = "/guilds/{guild.id}/preview",
    GuildChannels = "/guilds/{guild.id}/channels",
    GuildMembers = "/guilds/{guild.id}/members",
    GuildMember = "/guilds/{guild.id}/members/{user.id}",
    GuildMemberBotNick = "/guilds/{guild.id}/members/@me/nick",
    GuildMemberRole = "/guilds/{guild.id}/members/{user.id}/roles/{role.id}",
    GuildBans = "/guilds/{guild.id}/bans",
    GuildBan = "/guilds/{guild.id}/bans/{user.id}",
    GuildRoles = "/guilds/{guild.id}/roles",
    GuildRole = "/guilds/{guild.id}/roles/{role.id}",
    GuildPrune = "/guilds/{guild.id}/prune",
    GuildInvites = "/guilds/{guild.id}/invites",
    GuildIntegrations = "/guilds/{guild.id}/integrations",
    GuildIntegration = "/guilds/{guild.id}/integrations/{integration.id}",
    GuildIntegrationSync = "/guilds/{guild.id}/integrations/{integration.id}/sync",
    GuildWidget = "/guilds/{guild.id}/widget",
    GuildVanityURL = "/guilds/{guild.id}/vanity-url",
    UserBot = "/users/@me",
    User = "/users/{user.id}",
    UserBotGuilds = "/users/@me/guilds",
    UserBotGuild = "/users/@me/guild/{guild.id}",
    UserBotChannels = "/users/@me/channels",
    Invite = "/invites/{invite.code}",
    ChannelWebhooks = "/channels/{channel.id}/webhooks",
    GuildWebhooks = "/guilds/{guild.id}/webhooks",
    Webhook = "/webhooks/{webhook.id}"
}
/**
 * All endpoints mapped by their route name
 * @type {Record<EndpointRoute, (...args: string[]) => string>}
 */
export declare const Endpoints: Record<EndpointRoute, (...args: string[]) => string>;
/**
 * All headers used to identifier the rate limit information of the request
 */
export declare enum RateLimitHeaders {
    Global = "x-ratelimit-global",
    Limit = "x-ratelimit-limit",
    Remaining = "x-ratelimit-remaining",
    Reset = "x-ratelimit-reset",
    ResetAfter = "x-ratelimit-reset-after",
    Bucket = "x-ratelimit-bucket"
}
/**
 * All status codes that might be returned in response to an API request
 */
export declare enum StatusCode {
    /**
     * The request was successful
     */
    OK = 200,
    /**
     * The request was successful and led to the creation of a resource
     */
    Created = 201,
    /**
     * The request succeeded with no content as response
     * @type {number}
     */
    NoContent = 204,
    /**
     * The token is no longer valid
     */
    UnAuthorized = 401,
    /**
     * The bot has insufficient permissions to send this request
     */
    Forbidden = 403,
    /**
     * The rate limit has been reached
     */
    TooManyRequests = 429
}
