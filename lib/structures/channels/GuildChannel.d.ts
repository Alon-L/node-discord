import { Channel, ChannelType } from './Channel';
import { GuildCategoryChannel } from './GuildCategoryChannel';
import { Bot } from '../../bot';
import { ChannelPermissionsController } from '../../controllers/channel';
import { GuildChannelInvitesController, GuildChannelWebhooksController } from '../../controllers/guild';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../base';
import { PermissibleType, PermissionOverwriteFlags } from '../flags';
import { Guild } from '../guild';
/**
 * Options used when modifying a {@link GuildChannel}
 */
export interface GuildChannelOptions {
    /**
     * The new guild channel's name
     */
    name?: string;
    /**
     * The new type of the guild channel.
     * Can only change between {@link ChannelType.GuildText} and {@link ChannelType.GuildNews}
     */
    type?: ChannelType.GuildText | ChannelType.GuildNews;
    /**
     * The new topic of the guild channel
     */
    topic?: string | null;
    /**
     * Whether the guild channel should be marked as nsfw
     */
    nsfw?: boolean | null;
    /**
     * The guild channel's slow mode timeout (for {@link GuildTextChannel})
     */
    slowModeTimeout?: number | null;
    /**
     * The guild channel's audio bit rate (for {@link GuildVoiceChannel})
     */
    bitrate?: number | null;
    /**
     * The guild channel's user limit (for {@link GuildVoiceChannel})
     */
    userLimit?: number | null;
}
/**
 * Options for when creating new guild channels
 */
export interface CreateGuildChannelOptions extends GuildChannelOptions {
    /**
     * The name of the new channel
     */
    name: string;
    /**
     * The position of the new channel
     */
    position?: number;
    /**
     * The permissions of the new channel.
     * Object of user / roles IDs and their permissions for the new channel
     */
    permissions?: Record<Snowflake, PermissionOverwriteFlags & {
        type: PermissibleType;
    }>;
    /**
     * The ID of the parent category for the channel
     */
    parentId?: Snowflake;
}
/**
 * Represents a channel found in a guild of any type
 */
export declare class GuildChannel extends Channel {
    /**
     * The guild this channel is associated to
     */
    guild: Guild;
    /**
     * Sorting position of the channel
     */
    position: number;
    /**
     * This guild channel's permission overwrites controller
     */
    permissions: ChannelPermissionsController;
    /**
     * The name of the channel
     */
    name: string;
    /**
     * The topic of the channel.
     * Possibly null if channel does not have a topic
     */
    topic: string | null;
    /**
     * The guild channel's invites controller
     */
    invites: GuildChannelInvitesController;
    /**
     * The ID of this channel's parent category
     */
    parentId: Snowflake | undefined | null;
    /**
     * The guild channel's webhooks controller
     */
    webhooks: GuildChannelWebhooksController;
    constructor(bot: Bot, guildChannel: GatewayStruct, guild: Guild);
    /**
     * @ignore
     * @param {GatewayStruct} guildChannel The guild channel data
     * @returns {this}
     */
    init(guildChannel: GatewayStruct): this;
    /**
     * Parent {@link GuildCategoryChannel} of this channel.
     * Possibly null if this channel does not have a parent category channel, or the category is not cached
     */
    get parent(): GuildCategoryChannel | null;
    /**
     * Update a channel's settings. Requires the {@link Permission.ManageChannels} permission for the guild.
     * @param {GuildChannelOptions} options The modified channel's settings
     * @returns {Promise<GuildChannel>}
     */
    modify(options: GuildChannelOptions): Promise<GuildChannel>;
}
