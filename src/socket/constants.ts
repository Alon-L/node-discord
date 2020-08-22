/**
 * https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
 */
export const enum OPCode {
  Dispatch,
  Heartbeat,
  Identify,
  PresenceUpdate,
  VoiceStateUpdate,
  Resume = 6,
  Reconnect,
  RequestGuildMembers,
  InvalidSession,
  Hello,
  HeartbeatACK,
}

/**
 * https://discordapp.com/developers/docs/topics/gateway#commands-and-events-gateway-events
 */
export const enum GatewayEvent {
  Ready = 'READY',
  Close = 'CLOSE',
  Resumed = 'RESUMED',
  Reconnect = 'RECONNECT',
  InvalidSession = 'INVALID_SESSION',
  ChannelCreate = 'CHANNEL_CREATE',
  ChannelUpdate = 'CHANNEL_UPDATE',
  ChannelDelete = 'CHANNEL_DELETE',
  ChannelPinsUpdate = 'CHANNEL_PINS_UPDATE',
  GuildCreate = 'GUILD_CREATE',
  GuildUpdate = 'GUILD_UPDATE',
  GuildDelete = 'GUILD_DELETE',
  GuildBanAdd = 'GUILD_BAN_ADD',
  GuildBanRemove = 'GUILD_BAN_REMOVE',
  GuildEmojisUpdate = 'GUILD_EMOJIS_UPDATE',
  GuildIntegrationsUpdate = 'GUILD_INTEGRATIONS_UPDATE',
  GuildMemberAdd = 'GUILD_MEMBER_ADD',
  GuildMemberRemove = 'GUILD_MEMBER_REMOVE',
  GuildMemberUpdate = 'GUILD_MEMBER_UPDATE',
  GuildMembersChunk = 'GUILD_MEMBERS_CHUNK',
  GuildRoleCreate = 'GUILD_ROLE_CREATE',
  GuildRoleUpdate = 'GUILD_ROLE_UPDATE',
  GuildRoleDelete = 'GUILD_ROLE_DELETE',
  InviteCreate = 'INVITE_CREATE',
  InviteDelete = 'INVITE_DELETE',
  MessageCreate = 'MESSAGE_CREATE',
  MessageUpdate = 'MESSAGE_UPDATE',
  MessageDelete = 'MESSAGE_DELETE',
  MessageDeleteBulk = 'MESSAGE_DELETE_BULK',
  MessageReactionAdd = 'MESSAGE_REACTION_ADD',
  MessageReactionRemove = 'MESSAGE_REACTION_REMOVE',
  MessageReactionRemoveAll = 'MESSAGE_REACTION_REMOVE_ALL',
  MessageReactionRemoveEmoji = 'MESSAGE_REACTION_REMOVE_EMOJI',
  PresenceUpdate = 'PRESENCE_UPDATE',
  TypingStart = 'TYPING_START',
  UserUpdate = 'USER_UPDATE',
  VoiceStateUpdate = 'VOICE_STATE_UPDATE',
  VoiceServerUpdate = 'VOICE_SERVER_UPDATE',
  WebhooksUpdate = 'WEBHOOKS_UPDATE',
}

/**
 * All Bot events
 */
export enum BotEvent {
  Ready = 'READY',
  Close = 'CLOSE',
  Debug = 'DEBUG',
  /*Resumed = 'RESUMED',
  Reconnect = 'RECONNECT',
  InvalidSession = 'INVALID_SESSION',*/
  ChannelCreate = 'CHANNEL_CREATE',
  ChannelUpdate = 'CHANNEL_UPDATE',
  ChannelDelete = 'CHANNEL_DELETE',
  ChannelPinsUpdate = 'CHANNEL_PINS_UPDATE',
  GuildCreate = 'GUILD_CREATE',
  GuildUpdate = 'GUILD_UPDATE',
  GuildDelete = 'GUILD_DELETE',
  GuildBanAdd = 'GUILD_BAN_ADD',
  GuildBanRemove = 'GUILD_BAN_REMOVE',
  GuildEmojisUpdate = 'GUILD_EMOJIS_UPDATE',
  GuildIntegrationsUpdate = 'GUILD_INTEGRATIONS_UPDATE',
  GuildMemberAdd = 'GUILD_MEMBER_ADD',
  GuildMemberRemove = 'GUILD_MEMBER_REMOVE',
  GuildMemberUpdate = 'GUILD_MEMBER_UPDATE',
  GuildMembersChunk = 'GUILD_MEMBERS_CHUNK',
  GuildMembersChunkFinish = 'GUILD_MEMBERS_CHUNK_FINISH',
  GuildRoleCreate = 'GUILD_ROLE_CREATE',
  GuildRoleUpdate = 'GUILD_ROLE_UPDATE',
  GuildRoleDelete = 'GUILD_ROLE_DELETE',
  InviteCreate = 'INVITE_CREATE',
  InviteDelete = 'INVITE_DELETE',
  MessageCreate = 'MESSAGE_CREATE',
  MessageUpdate = 'MESSAGE_UPDATE',
  MessageDelete = 'MESSAGE_DELETE',
  MessageDeleteBulk = 'MESSAGE_DELETE_BULK',
  MessageReactionAdd = 'MESSAGE_REACTION_ADD',
  MessageReactionRemove = 'MESSAGE_REACTION_REMOVE',
  MessageReactionRemoveAll = 'MESSAGE_REACTION_REMOVE_ALL',
  MessageReactionRemoveEmoji = 'MESSAGE_REACTION_REMOVE_EMOJI',
  PresenceUpdate = 'PRESENCE_UPDATE',
  ShardReady = 'SHARD_READY',
  ShardClose = 'SHARD_CLOSE',
  TypingStart = 'TYPING_START',
  UserUpdate = 'USER_UPDATE',
  /*VoiceStateUpdate = 'VOICE_STATE_UPDATE',
  VoiceServerUpdate = 'VOICE_SERVER_UPDATE',*/
  WebhooksUpdate = 'WEBHOOKS_UPDATE',
}

/**
 * https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes
 */
export const enum GatewayCloseCode {
  NormalClosure = 1000,
  ManualClosure = 3000,
  UnknownError = 4000,
  UnknownOpcode,
  DecodeError,
  NotAuthenticated,
  AuthenticationFailed,
  AlreadyAuthenticated,
  InvalidSeq = 4007,
  RateLimited,
  SessionTimedOut,
  InvalidShard,
  ShardingRequired,
  InvalidAPIVersion,
  InvalidIntent,
  DisallowedIntent,
}

export const UnreconnectableGatewayCloseCodes: GatewayCloseCode[] = [
  GatewayCloseCode.ManualClosure,
  GatewayCloseCode.AuthenticationFailed,
  GatewayCloseCode.InvalidShard,
  GatewayCloseCode.ShardingRequired,
  GatewayCloseCode.InvalidIntent,
  GatewayCloseCode.DisallowedIntent,
];

export const UnresumeableGatewayCloseCodes: GatewayCloseCode[] = [
  GatewayCloseCode.NormalClosure,
  GatewayCloseCode.InvalidSeq,
];

export const recommendedShardTimeout = 5500;
