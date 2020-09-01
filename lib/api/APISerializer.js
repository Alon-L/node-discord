"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APISerializer = void 0;
const structures_1 = require("../structures");
const message_1 = require("../structures/message");
/**
 * Serializes API options and data into the API format
 */
class APISerializer {
    /**
     * Serializes an array of role IDs and role instances into an array of role IDs
     * @param {(Role | Snowflake)[]} roles The roles array
     * @returns {Snowflake[]}
     */
    static roleIds(roles) {
        return roles.map((role) => (role instanceof structures_1.Role ? role.id : role));
    }
    /**
     * Returns the serialized guild channel options for when modifying a guild channel
     * @param {GuildChannelOptions} options The guild channel options
     * @returns {Params}
     */
    static guildChannelOptions(options) {
        return {
            name: options.name,
            type: options.type,
            topic: options.topic,
            nsfw: options.nsfw,
            rate_limit_per_user: options.slowModeTimeout,
            bitrate: options.bitrate,
            user_limit: options.userLimit,
        };
    }
    /**
     * Returns the serialized fetch some messages options for when fetching some messages in a text channel
     * @param {FetchSomeMessagesOptions} options The fetch some messages options
     * @returns {Params}
     */
    static fetchSomeMessagesOptions(options) {
        return (options && {
            around: options.around,
            before: options.before,
            after: options.after,
            limit: options.limit,
        });
    }
    /**
     * Returns the serialized message data for when sending or editing messages
     * @param {MessageData} data The message data
     * @returns {Params}
     */
    static messageData(data) {
        const { content, embed } = data;
        return {
            content,
            embed: embed &&
                (embed instanceof message_1.MessageEmbed ? embed.structure : message_1.MessageEmbed.dataToStructure(embed)),
        };
    }
    /**
     * Returns the serialized fetch reactions options for when fetching all users that reacted with a reaction
     * @param {FetchReactionUsersOptions} options The fetch reaction users options
     * @returns {Params}
     */
    static fetchReactionUsersOptions(options) {
        return options && options;
    }
    /**
     * Returns the serialized guild channel permissions for when modifying a guild channel's permissions
     * @param {Permissible} permissible Data for the member or role
     * @param {PermissionOverwriteFlags} flags The modified permissions
     * @returns {Params}
     */
    static guildChannelPermissions(permissible, flags) {
        var _a, _b;
        return {
            type: permissible.type,
            allow: (_a = flags.allow) === null || _a === void 0 ? void 0 : _a.bits,
            deny: (_b = flags.deny) === null || _b === void 0 ? void 0 : _b.bits,
        };
    }
    /**
     * Returns the serialized create guild channel options for creating new guild channels
     * @param {CreateGuildChannelOptions} options The create guild channel options
     * @returns {Params}
     */
    static createGuildChannelOptions(options) {
        return {
            name: options.name,
            type: options.type,
            topic: options.topic,
            bitrate: options.bitrate,
            user_limit: options.userLimit,
            rate_limit_per_user: options.slowModeTimeout,
            position: options.position,
            permission_overwrites: options.permissions &&
                Object.entries(options.permissions).map(([id, overwrite]) => {
                    var _a, _b;
                    return ({
                        id,
                        type: overwrite.type,
                        allow: (_a = overwrite.allow) === null || _a === void 0 ? void 0 : _a.bits,
                        deny: (_b = overwrite.deny) === null || _b === void 0 ? void 0 : _b.bits,
                    });
                }),
            parent_id: options.parentId,
            nsfw: options.nsfw,
        };
    }
    /**
     * Returns the serialized positions for when modifying lists positions
     * @param {Positions} positions The new positions
     * @returns {Params}
     */
    static positions(positions) {
        return Object.entries(positions).map(([id, position]) => ({ id, position }));
    }
    /**
     * Returns the serialized invite options for when creating a guild channel invite
     * @param {InviteOptions} options The invite options
     * @returns {Params}
     */
    static inviteOptions(options) {
        var _a, _b;
        return options
            ? {
                max_age: (_a = options.max) === null || _a === void 0 ? void 0 : _a.age,
                max_uses: (_b = options.max) === null || _b === void 0 ? void 0 : _b.uses,
                temporary: options.temporary,
                unique: options.unique,
            }
            : {};
    }
    /**
     * Returns the serialized modify emoji options for modifying emojis
     * @param {ModifyEmojiOptions} options The modify emoji options
     * @returns {Params}
     */
    static modifyEmojiOptions(options) {
        return {
            name: options.name,
            // Serialize the role IDs
            roles: options.roles && APISerializer.roleIds(options.roles),
        };
    }
    /**
     * Returns the serialized create emoji options for when creating emojis
     * @param {CreateEmojiOptions} options The create emoji options
     * @returns {Promise<Params>}
     */
    static createEmojiOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                name: options.name,
                image: yield options.image.stringify(),
                roles: options.roles,
            };
        });
    }
    /**
     * Returns the serialized fetch guild options for when fetching a guild
     * @param {FetchGuildOptions} options The fetch guild options
     * @returns {Params}
     */
    static fetchGuildOptions(options) {
        return (options && {
            with_counts: options.withCounts,
        });
    }
    /**
     * Returns the serialized modify guild options for when modifying a guild
     * @param {ModifyGuildOptions} options The modify guild options
     * @returns {Promise<Params>}
     */
    static modifyGuildOptions(options) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            return {
                name: options.name,
                region: options.region,
                verification_level: (_a = options.levels) === null || _a === void 0 ? void 0 : _a.verification,
                default_message_notifications: (_b = options.levels) === null || _b === void 0 ? void 0 : _b.notifications,
                explicit_content_filter: (_c = options.levels) === null || _c === void 0 ? void 0 : _c.explicitContent,
                afk_channel_id: (_e = (_d = options.afk) === null || _d === void 0 ? void 0 : _d.channel) === null || _e === void 0 ? void 0 : _e.id,
                afk_timeout: (_f = options.afk) === null || _f === void 0 ? void 0 : _f.timeout,
                icon: options.icon && (yield options.icon.stringify()),
                owner_id: options.ownerId,
                splash: options.splash && (yield options.splash.stringify()),
                banner: options.banner && (yield options.banner.stringify()),
                system_channel_id: options.systemChannelId,
                rules_channel_id: options.rulesChannelId,
                public_updates_channel_id: options.updatesChannelId,
                preferred_locale: options.locale,
            };
        });
    }
    /**
     * Returns the serialized fetch all members options for when fetching all members in a guild
     * @param {ModifyGuildOptions} options The fetch all members options
     * @returns {Params}
     */
    static fetchSomeMembersOptions(options) {
        return (options && {
            limit: options.limit,
            after: options.after,
        });
    }
    /**
     * Returns the serialized modify member options for when modifying guild members
     * @param {ModifyMemberOptions} options The modify member options
     * @returns {Params}
     */
    static modifyMemberOptions(options) {
        return {
            nick: options.nick,
            // Serialize the role IDs
            roles: options.roles && APISerializer.roleIds(options.roles),
            mute: options.mute,
            deaf: options.deaf,
            channel_id: options.channelId,
        };
    }
    /**
     * Returns the serialized ban member options for when banning guild members
     * @param {MemberBanOptions} options The ban member options
     * @returns {Params}
     */
    static banMemberOptions(options) {
        return {
            reason: options.reason,
            delete_message_days: options.deleteMessageDays,
        };
    }
    /**
     * Returns the serialized role options for when creating or modifying roles
     * @param {RoleOptions} options The role options
     * @returns {Params}
     */
    static roleOptions(options) {
        var _a;
        return (options && {
            name: options.name,
            permissions: (_a = options.permissions) === null || _a === void 0 ? void 0 : _a.bits,
            color: options.color,
            hoist: options.listedSeparately,
            mentionable: options.mentionable,
        });
    }
    /**
     * Returns the serialized prune count options for when getting a guild prune count
     * @param {PruneCountOptions} options The prune count options
     * @returns {Params}
     */
    static pruneCountOptions(options) {
        return (options && {
            days: options.days,
            include_roles: options.includeRoles,
        });
    }
    /**
     * Returns the serialized prune options for when beginning a guild prune operation
     * @param {PruneOptions} options The prune options
     * @returns {Params}
     */
    static pruneOptions(options) {
        return (options && Object.assign(Object.assign({}, APISerializer.pruneCountOptions(options)), { compute_prune_count: options.computePruneCount }));
    }
    /**
     * Returns the serialized create integration options for when creating new guild integrations
     * @param {CreateIntegrationOptions} options The create integration options
     * @returns {Params}
     */
    static createIntegrationOptions(options) {
        return {
            type: options.type,
            id: options.id,
        };
    }
    /**
     * Returns the serialized modify integration options for when modifying guild integrations
     * @param {ModifyIntegrationOptions} options The modify integration options
     * @returns {Params}
     */
    static modifyIntegrationOptions(options) {
        var _a, _b;
        return {
            expire_behavior: (_a = options.expire) === null || _a === void 0 ? void 0 : _a.behavior,
            expire_grace_period: (_b = options.expire) === null || _b === void 0 ? void 0 : _b.gracePeriod,
            enable_emoticons: options.enableEmoticons,
        };
    }
    /**
     * Returns the serialized modify widget options for when modifying a guild widget
     * @param {ModifyWidgetOptions} options The modify widget options
     * @returns {Params}
     */
    static modifyWidgetOptions(options) {
        return {
            enabled: options.enabled,
            channel_id: options.channelId,
        };
    }
    /**
     * Returns the serialized modify bot user options for when modifying this bot's user
     * @param {ModifyBotUserOptions} options The modify bot user options
     * @returns {Promise<Params>}
     */
    static modifyBotUserOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                username: options.username,
                avatar: options.avatar && (yield options.avatar.stringify()),
            };
        });
    }
    /**
     * Returns the serialized fetch guilds options for when fetching the guilds the bot's user is in
     * @param {FetchGuildsOptions} options The fetch guilds options
     * @returns {Params}
     */
    static fetchGuildsOptions(options) {
        return (options && {
            before: options.before,
            after: options.after,
            limit: options.limit,
        });
    }
    /**
     * Returns the serialized parameters for when creating a new DM channel
     * @param {Snowflake} userId The ID of the DM channel recipient user
     * @returns {Params}
     */
    static createDM(userId) {
        return {
            recipient_id: userId,
        };
    }
    /**
     * Returns the serialized fetch invite options for when fetching an invite
     * @param {FetchInviteOptions} options The fetch invite options
     * @returns {Params}
     */
    static fetchInviteOptions(options) {
        return (options && {
            with_counts: options.withCounts,
        });
    }
    /**
     * Returns the serialized create webhook options for when creating webhooks
     * @param {CreateWebhookOptions} options The create webhook options
     * @returns {Promise<Params>}
     */
    static createWebhookOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                name: options.name,
                avatar: options.avatar && (yield options.avatar.stringify()),
            };
        });
    }
    /**
     * Returns the serialized modify webhook options for when modifying webhooks
     * @param {ModifyWebhookOptions} options The modify webhook options
     * @returns {Promise<Params>}
     */
    static modifyWebhookOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                name: options.name,
                avatar: options.avatar && (yield options.avatar.stringify()),
                channel_id: options.channelId,
            };
        });
    }
}
exports.APISerializer = APISerializer;
