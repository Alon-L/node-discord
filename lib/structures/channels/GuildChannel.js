"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildChannel = void 0;
const Channel_1 = require("./Channel");
const channel_1 = require("../../controllers/channel");
const guild_1 = require("../../controllers/guild");
const PermissionOverwrite_1 = require("../PermissionOverwrite");
/**
 * Represents a channel found in a guild of any type
 */
class GuildChannel extends Channel_1.Channel {
    constructor(bot, guildChannel, guild) {
        super(bot, guildChannel);
        this.guild = guild;
        this.invites = new guild_1.GuildChannelInvitesController(this);
        this.webhooks = new guild_1.GuildChannelWebhooksController(this);
    }
    /**
     * @ignore
     * @param {GatewayStruct} guildChannel The guild channel data
     * @returns {this}
     */
    init(guildChannel) {
        super.init(guildChannel);
        this.position = guildChannel.position;
        this.permissions = new channel_1.ChannelPermissionsController(this);
        if (guildChannel.permission_overwrites) {
            this.permissions.cache.addMany(guildChannel.permission_overwrites.map((permission) => new PermissionOverwrite_1.PermissionOverwrite(this.bot, permission, this)));
        }
        this.name = guildChannel.name;
        this.topic = guildChannel.topic;
        this.parentId = guildChannel.parent_id;
        return this;
    }
    /**
     * Parent {@link GuildCategoryChannel} of this channel.
     * Possibly null if this channel does not have a parent category channel, or the category is not cached
     */
    get parent() {
        if (!this.parentId)
            return null;
        return this.guild.channels.cache.get(this.parentId) || null;
    }
    /**
     * Update a channel's settings. Requires the {@link Permission.ManageChannels} permission for the guild.
     * @param {GuildChannelOptions} options The modified channel's settings
     * @returns {Promise<GuildChannel>}
     */
    modify(options) {
        return this.bot.api.modifyGuildChannel(this.id, options);
    }
}
exports.GuildChannel = GuildChannel;
