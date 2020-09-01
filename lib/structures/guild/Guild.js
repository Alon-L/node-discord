"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = exports.BoostTiers = exports.MFALevel = exports.ExplicitContentLevels = exports.NotificationLevels = exports.VerificationLevel = void 0;
const GuildEmoji_1 = require("./GuildEmoji");
const GuildPreview_1 = require("./GuildPreview");
const GuildUnavailable_1 = require("./GuildUnavailable");
const GuildWidget_1 = require("./GuildWidget");
const Collection_1 = __importDefault(require("../../Collection"));
const guild_1 = require("../../controllers/guild");
const guild_2 = require("../../controllers/guild");
const GuildWebhooksController_1 = require("../../controllers/guild/GuildWebhooksController");
const Avatar_1 = require("../Avatar");
const Role_1 = require("../Role");
const utils_1 = require("../channels/utils");
const flags_1 = require("../flags");
const member_1 = require("../member");
const GuildVoice_1 = require("../voice/GuildVoice");
const VoiceState_1 = require("../voice/VoiceState");
/**
 * Guild verification levels
 */
var VerificationLevel;
(function (VerificationLevel) {
    VerificationLevel[VerificationLevel["None"] = 0] = "None";
    VerificationLevel[VerificationLevel["Low"] = 1] = "Low";
    VerificationLevel[VerificationLevel["Medium"] = 2] = "Medium";
    VerificationLevel[VerificationLevel["High"] = 3] = "High";
    VerificationLevel[VerificationLevel["VeryHigh"] = 4] = "VeryHigh";
})(VerificationLevel = exports.VerificationLevel || (exports.VerificationLevel = {}));
/**
 * Guild default notification levels
 */
var NotificationLevels;
(function (NotificationLevels) {
    NotificationLevels[NotificationLevels["AllMessages"] = 0] = "AllMessages";
    NotificationLevels[NotificationLevels["OnlyMentions"] = 1] = "OnlyMentions";
})(NotificationLevels = exports.NotificationLevels || (exports.NotificationLevels = {}));
/**
 * Guild explicit content filtering levels
 */
var ExplicitContentLevels;
(function (ExplicitContentLevels) {
    ExplicitContentLevels[ExplicitContentLevels["Disabled"] = 0] = "Disabled";
    ExplicitContentLevels[ExplicitContentLevels["MembersWithoutRoles"] = 1] = "MembersWithoutRoles";
    ExplicitContentLevels[ExplicitContentLevels["AllMembers"] = 2] = "AllMembers";
})(ExplicitContentLevels = exports.ExplicitContentLevels || (exports.ExplicitContentLevels = {}));
/**
 * MFA levels required for the Guild
 */
var MFALevel;
(function (MFALevel) {
    MFALevel[MFALevel["None"] = 0] = "None";
    MFALevel[MFALevel["Elevated"] = 1] = "Elevated";
})(MFALevel = exports.MFALevel || (exports.MFALevel = {}));
/**
 * Guild premium (boost) tiers
 */
var BoostTiers;
(function (BoostTiers) {
    BoostTiers[BoostTiers["None"] = 0] = "None";
    BoostTiers[BoostTiers["Tier1"] = 1] = "Tier1";
    BoostTiers[BoostTiers["Tier2"] = 2] = "Tier2";
    BoostTiers[BoostTiers["Tier3"] = 3] = "Tier3";
})(BoostTiers = exports.BoostTiers || (exports.BoostTiers = {}));
/**
 * Guilds in Discord represent an isolated collection of users and channels, and are often referred to as "servers" in the UI.
 * @extends BaseStruct
 */
class Guild extends GuildPreview_1.GuildPreview {
    constructor(bot, guild, shardId) {
        super(bot, guild);
        this.shardId = shardId;
    }
    /**
     * @ignore
     * @param {GatewayStruct} guild The guild data
     * @returns {this}
     */
    init(guild) {
        super.init(guild);
        this.presences = new Collection_1.default();
        this.roles = new guild_2.GuildRolesController(this);
        this.members = new guild_1.GuildMembersController(this);
        this.emojis = new guild_1.GuildEmojisController(this);
        this.channels = new guild_1.GuildChannelsController(this);
        this.invites = new guild_1.GuildInvitesController(this);
        this.bans = new guild_2.GuildBansController(this);
        this.integrations = new guild_2.GuildIntegrationsController(this);
        this.webhooks = new GuildWebhooksController_1.GuildWebhooksController(this);
        this.voice = new GuildVoice_1.GuildVoice(this);
        this.voiceStates = new Collection_1.default();
        if (guild.channels) {
            this.channels.cache.addMany(guild.channels.map((channel) => utils_1.ChannelUtils.createGuildChannel(this.bot, channel, this)));
        }
        // Add all of this guild's cached channels to the Bot's cached channels
        this.bot.channels.cache.merge(this.channels.cache);
        this.roles.cache.addMany(guild.roles.map((role) => new Role_1.Role(this.bot, role, this)));
        if (guild.members) {
            this.members.cache.addMany(guild.members.map((member) => {
                var _a;
                return new member_1.Member(this.bot, member, this, (_a = guild.presences) === null || _a === void 0 ? void 0 : _a.find((presence) => presence.user.id === member.user.id));
            }));
        }
        if (guild.voice_states) {
            for (const voicestate of guild.voice_states) {
                this.voiceStates.set(voicestate.user_id, new VoiceState_1.VoiceState(this.bot, this.members.cache.get(voicestate.user_id), voicestate));
            }
        }
        this.owner = this.members.cache.get(guild.owner_id);
        this.ownerId = guild.owner_id;
        if (guild.permissions) {
            this.permissions = new flags_1.PermissionFlags(guild.permissions.toString());
        }
        this.region = guild.region;
        this.afk = {
            channel: guild.afk_channel_id && this.channels.cache.get(guild.afk_channel_id),
            timeout: guild.afk_timeout,
        };
        this.levels = {
            verification: guild.verification_level,
            notifications: guild.default_message_notifications,
            explicitContent: guild.explicit_content_filter,
            mfa: guild.mfa_level,
        };
        this.emojis.cache.addMany(guild.emojis.map((emoji) => new GuildEmoji_1.GuildEmoji(this.bot, emoji, this)));
        // Add all of this guild's cached emojis to the Bot's cached emojis
        this.bot.emojis.merge(this.emojis.cache);
        this.applicationId = guild.application_id;
        this.widget = new GuildWidget_1.GuildWidget(this.bot, 
        // Serializes the guild widget data
        { enabled: guild.widget_enabled, channel_id: guild.widget_channel_id }, this);
        this.systemChannel = {
            channel: this.channels.cache.get(guild.system_channel_id),
            flags: new flags_1.GuildSystemChannelFlags(guild.system_channel_flags),
        };
        this.rulesChannel = this.channels.cache.get(guild.rules_channel_id);
        this.createdAt = guild.joined_at;
        this.large = guild.large;
        this.unavailable = guild.unavailable;
        this.memberCount = guild.member_count;
        this.maxPresences = guild.max_presences;
        this.maxMembers = guild.max_members;
        this.vanityURLCode = guild.vanity_url_code;
        this.description = guild.description;
        this.bannerHash = guild.banner;
        this.boosts = {
            tier: guild.premium_tier,
            boostsCount: guild.premium_subscription_count,
        };
        this.locale = guild.locale;
        if (guild.public_updates_channel_id) {
            this.updatesChannel = this.channels.cache.get(guild.public_updates_channel_id);
        }
        return this;
    }
    /**
     * Returns the URL of the guild's banner image.
     * Possibly returns null if the guild does not have a banner image
     * @param {GuildBannerFormat} format The format of the returned guild banner image
     * @param {number} size The size of the returned guild banner image
     * @returns {string | null}
     */
    bannerURL(format = Avatar_1.GuildBannerFormat.PNG, size) {
        return this.bannerHash && Avatar_1.Avatar.bannerURL(this.bannerHash, this.id, format, size);
    }
    /**
     * Modifies this guild's settings.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {ModifyGuildOptions} options The new options for the updated guild
     * @returns {Promise<Guild>}
     */
    modify(options) {
        return this.bot.api.modifyGuild(this.id, options);
    }
    /**
     * Returns the number of members that would be removed in a prune operation.
     * Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.
     * @param {PruneCountOptions} options Options for the prune
     * @returns {Promise<number>}
     */
    pruneCount(options) {
        return this.bot.api.guildPruneCount(this.id, options);
    }
    /**
     * Begins a prune operation on this guild.
     * Requires the {@link Permission.KickMembers} permission
     * @param {PruneOptions} options The options for the prune operation
     * @returns {Promise<number | null>} The number of members that were removed in the prune operation, or null if the {@link PruneOptions.computePruneCount} is false
     */
    prune(options) {
        return this.bot.api.guildPrune(this.id, options);
    }
    /**
     * Fetches this guild's widget object.
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<GuildWidget>}
     */
    fetchWidget() {
        return this.bot.api.fetchGuildWidget(this.id);
    }
    /**
     * Fetches this guild's vanity URL.
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<GuildVanityInvite>}
     */
    fetchVanityURL() {
        return this.bot.api.fetchGuildVanityURL(this.id);
    }
    /**
     * Leaves this guild
     * @returns {Promise<void>}
     */
    leave() {
        return this.bot.api.leaveGuild(this.id);
    }
    // Returns undefined if the guilds fetched via REST and not received by gateway
    get shard() {
        return this.bot.connection.shards.get(this.shardId);
    }
    /**
     * Creates a {@link Guild} or {@link GuildUnavailable}
     * @param {Bot} bot The bot instance
     * @param {GatewayStruct} guild The guild data
     * @param {number} [shardId] The shard id that belongs to that guild
     * @returns {Guild | GuildUnavailable}
     * @ignore
     */
    static create(bot, guild, shardId) {
        return guild.unavailable
            ? new GuildUnavailable_1.GuildUnavailable(bot, guild, shardId)
            : new Guild(bot, guild, shardId);
    }
    /**
     * Finds a {@link Guild} or {@link GuildUnavailable} from the correct cache
     * @param {Bot} bot The bot instance
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Guild | GuildUnavailable | undefined}
     * @ignore
     */
    static find(bot, guildId) {
        if (bot.unavailableGuilds.has(guildId)) {
            // Guild is part of the unavailable guilds collection
            return bot.unavailableGuilds.get(guildId);
        }
        else {
            // Guild is part of the guilds collection
            return bot.guilds.cache.get(guildId);
        }
    }
    /**
     * Caches a guild in the correct collection
     * @param {Bot} bot The bot instance
     * @param {Guild | GuildUnavailable} guild The guild you wish to cache
     * @ignore
     */
    static cache(bot, guild) {
        if (guild instanceof Guild) {
            bot.guilds.cache.add(guild);
        }
        else {
            bot.unavailableGuilds.set(guild.id, guild);
        }
    }
    /**
     * Deletes a guild from the correct cache
     * @param {Bot} bot The bot instance
     * @param {Guild | GuildUnavailable} guild The available / unavailable guild
     * @ignore
     */
    static delete(bot, guild) {
        if (guild instanceof Guild) {
            // The bot left the guild or it has become unavailable.
            bot.guilds.cache.delete(guild.id);
        }
        else {
            bot.unavailableGuilds.set(guild.id, guild);
        }
    }
}
exports.Guild = Guild;
