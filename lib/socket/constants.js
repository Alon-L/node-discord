"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendedShardTimeout = exports.UnresumeableGatewayCloseCodes = exports.UnreconnectableGatewayCloseCodes = exports.BotEvent = void 0;
/**
 * All Bot events
 */
var BotEvent;
(function (BotEvent) {
    BotEvent["Ready"] = "READY";
    BotEvent["Close"] = "CLOSE";
    BotEvent["Debug"] = "DEBUG";
    /*Resumed = 'RESUMED',
    Reconnect = 'RECONNECT',
    InvalidSession = 'INVALID_SESSION',*/
    BotEvent["ChannelCreate"] = "CHANNEL_CREATE";
    BotEvent["ChannelUpdate"] = "CHANNEL_UPDATE";
    BotEvent["ChannelDelete"] = "CHANNEL_DELETE";
    BotEvent["ChannelPinsUpdate"] = "CHANNEL_PINS_UPDATE";
    BotEvent["GuildCreate"] = "GUILD_CREATE";
    BotEvent["GuildUpdate"] = "GUILD_UPDATE";
    BotEvent["GuildDelete"] = "GUILD_DELETE";
    BotEvent["GuildBanAdd"] = "GUILD_BAN_ADD";
    BotEvent["GuildBanRemove"] = "GUILD_BAN_REMOVE";
    BotEvent["GuildEmojisUpdate"] = "GUILD_EMOJIS_UPDATE";
    BotEvent["GuildIntegrationsUpdate"] = "GUILD_INTEGRATIONS_UPDATE";
    BotEvent["GuildMemberAdd"] = "GUILD_MEMBER_ADD";
    BotEvent["GuildMemberRemove"] = "GUILD_MEMBER_REMOVE";
    BotEvent["GuildMemberUpdate"] = "GUILD_MEMBER_UPDATE";
    BotEvent["GuildMembersChunk"] = "GUILD_MEMBERS_CHUNK";
    BotEvent["GuildMembersChunkFinish"] = "GUILD_MEMBERS_CHUNK_FINISH";
    BotEvent["GuildRoleCreate"] = "GUILD_ROLE_CREATE";
    BotEvent["GuildRoleUpdate"] = "GUILD_ROLE_UPDATE";
    BotEvent["GuildRoleDelete"] = "GUILD_ROLE_DELETE";
    BotEvent["InviteCreate"] = "INVITE_CREATE";
    BotEvent["InviteDelete"] = "INVITE_DELETE";
    BotEvent["MessageCreate"] = "MESSAGE_CREATE";
    BotEvent["MessageUpdate"] = "MESSAGE_UPDATE";
    BotEvent["MessageDelete"] = "MESSAGE_DELETE";
    BotEvent["MessageDeleteBulk"] = "MESSAGE_DELETE_BULK";
    BotEvent["MessageReactionAdd"] = "MESSAGE_REACTION_ADD";
    BotEvent["MessageReactionRemove"] = "MESSAGE_REACTION_REMOVE";
    BotEvent["MessageReactionRemoveAll"] = "MESSAGE_REACTION_REMOVE_ALL";
    BotEvent["MessageReactionRemoveEmoji"] = "MESSAGE_REACTION_REMOVE_EMOJI";
    BotEvent["PresenceUpdate"] = "PRESENCE_UPDATE";
    BotEvent["ShardReady"] = "SHARD_READY";
    BotEvent["ShardClose"] = "SHARD_CLOSE";
    BotEvent["TypingStart"] = "TYPING_START";
    BotEvent["UserUpdate"] = "USER_UPDATE";
    BotEvent["VoiceStateUpdate"] = "VOICE_STATE_UPDATE";
    BotEvent["VoiceServerUpdate"] = "VOICE_SERVER_UPDATE";
    BotEvent["WebhooksUpdate"] = "WEBHOOKS_UPDATE";
})(BotEvent = exports.BotEvent || (exports.BotEvent = {}));
exports.UnreconnectableGatewayCloseCodes = [
    3000 /* ManualClosure */,
    4004 /* AuthenticationFailed */,
    4010 /* InvalidShard */,
    4011 /* ShardingRequired */,
    4013 /* InvalidIntent */,
    4014 /* DisallowedIntent */,
];
exports.UnresumeableGatewayCloseCodes = [
    1000 /* NormalClosure */,
    4007 /* InvalidSeq */,
];
exports.recommendedShardTimeout = 5500;
