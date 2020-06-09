/**
 * https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
 */
export enum OPCodes {
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
export enum GatewayEvents {
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
export enum BotEvents {
  Ready = 'READY',
  Close = 'CLOSE',
  Debug = 'DEBUG',
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
  TypingStart = 'TYPING_START',
  UserUpdate = 'USER_UPDATE',
  VoiceStateUpdate = 'VOICE_STATE_UPDATE',
  VoiceServerUpdate = 'VOICE_SERVER_UPDATE',
  WebhooksUpdate = 'WEBHOOKS_UPDATE',
  ShardReady = 'SHARD_READY',
  ShardClose = 'SHARD_CLOSE',
}

/**
 * All Discord permission flags
 * https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
 */
export enum PermissionFlagTypes {
  CreateInstantInvite = 0x00000001,
  KickMembers = 0x00000002,
  BanMembers = 0x00000004,
  Administrator = 0x00000008,
  ManageChannels = 0x00000010,
  ManageGuild = 0x00000020,
  AddReactions = 0x00000040,
  ViewAuditLog = 0x00000080,
  PrioritySpeaker = 0x00000100,
  Stream = 0x00000200,
  ViewChannel = 0x00000400,
  SendMessages = 0x00000800,
  SendTTSMessages = 0x00001000,
  ManageMessages = 0x00002000,
  EmbedLinks = 0x00004000,
  AttachFiles = 0x00008000,
  ReadMessageHistory = 0x00010000,
  MentionEveryone = 0x00020000,
  UseExternalEmojis = 0x00040000,
  ViewGuildInsights = 0x00080000,
  Connect = 0x00100000,
  Speak = 0x00200000,
  MuteMembers = 0x00400000,
  DeafenMembers = 0x00800000,
  MoveMembers = 0x01000000,
  UseVAD = 0x02000000,
  ChangeNickname = 0x04000000,
  ManageNicknames = 0x08000000,
  ManageRoles = 0x10000000,
  ManageWebhooks = 0x20000000,
  ManageEmojis = 0x40000000,
}

/**
 * All Discord user flags (profile badges)
 * https://discord.com/developers/docs/resources/user#user-object-user-flags
 */
export enum UserFlagTypes {
  None,
  DiscordEmployee = 1 << 0,
  DiscordPartner = 1 << 1,
  HypeSquadEvents = 1 << 2,
  BugHunterLevel1 = 1 << 3,
  HouseBravery = 1 << 6,
  HouseBrilliance = 1 << 7,
  HouseBalance = 1 << 8,
  EarlySupporter = 1 << 9,
  TeamUser = 1 << 10,
  System = 1 << 12,
  BugHunterLevel2 = 1 << 14,
  VerifiedBot = 1 << 16,
  VerifiedBotDeveloper = 1 << 17,
}

/**
 * All Discord presence activity flags
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-flags
 */
export enum PresenceActivityFlagTypes {
  Instance = 1 << 0,
  Join = 1 << 1,
  Spectate = 1 << 2,
  JoinRequest = 1 << 3,
  Sync = 1 << 4,
  Play = 1 << 5,
}

/**
 * All message flags
 * https://discord.com/developers/docs/resources/channel#message-object-message-flags
 */
export enum MessageFlagTypes {
  /**
   * This message has been published to subscribed channels (via Channel Following)
   */
  Crossposted = 1 << 0,

  /**
   * This message originated from a message in another channel (via Channel Following)
   */
  IsCrosspost = 1 << 1,

  /**
   * Do not include any embeds when serializing this message
   */
  SuppressEmbeds = 1 << 2,

  /**
   * The source message for this crosspost has been deleted (via Channel Following)
   */
  SourceMessageDeleted = 1 << 3,

  /**
   * This message came from the urgent message system
   */
  Urgent = 1 << 4,
}

/**
 * All guild system channel flags
 * https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
 */
export enum GuildSystemChannelFlagTypes {
  /**
   * Suppress member join notifications
   */
  SuppressJoinNotifications = 1 << 0,

  /**
   * Suppress server boost notifications
   */
  SuppressBoosts = 1 << 1,
}

/**
 * All guild features
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-features
 */
export enum GuildFeatures {
  /**
   * Guild has access to set an invite splash background
   */
  InviteSplash = 'INVITE_SPLASH',

  /**
   * Guild has access to set 384kbps bitrate in voice (previously VIP voice servers)
   */
  VIPRegions = 'VIP_REGIONS',

  /**
   * Guild has access to set a vanity URL
   */
  VanityURL = 'VANITY_URL',

  /**
   * Guild is verified
   */
  Verified = 'VERIFIED',

  /**
   * Guild is partnered
   */
  Partnered = 'PARTNERED',

  /**
   * Guild is public
   */
  Public = 'PUBLIC',

  /**
   * Guild has access to use commerce features (i.e. create store channels)
   */
  Commerce = 'COMMERCE',

  /**
   * Guild has access to create news channels
   */
  News = 'NEWS',

  /**
   * Guild is able to be discovered in the directory
   */
  Discoverable = 'DISCOVERABLE',

  /**
   * Guild is able to be featured in the directory
   */
  Featurable = 'FEATURABLE',

  /**
   * Guild has access to set an animated guild icon
   */
  AnimatedIcon = 'ANIMATED_ICON',

  /**
   * Guild has access to set a guild banner image
   */
  Banner = 'BANNER',

  /**
   * Guild cannot be public
   */
  PublicDisabled = 'PUBLIC_DISABLED',

  /**
   * Guild has enabled the welcome screen
   */
  WelcomeScreenEnabled = 'WELCOME_SCREEN_ENABLED',
}

/**
 * https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes
 */
export enum GatewayCloseCodes {
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

export const unreconnectableGatewayCloseCodes: GatewayCloseCodes[] = [
  GatewayCloseCodes.ManualClosure,
  GatewayCloseCodes.AuthenticationFailed,
  GatewayCloseCodes.InvalidShard,
  GatewayCloseCodes.ShardingRequired,
  GatewayCloseCodes.InvalidIntent,
  GatewayCloseCodes.DisallowedIntent,
];

export const unresumeableGatewayCloseCodes: GatewayCloseCodes[] = [
  GatewayCloseCodes.NormalClosure,
  GatewayCloseCodes.InvalidSeq,
];

export const recommendedShardTimeout = 5500;
