import { Channel, ChannelType } from './Channel';
import { GuildCategoryChannel } from './GuildCategoryChannel';
import { Snowflake } from '../../types';
import { PermissionOverwrite } from '../PermissionOverwrite';
import { GatewayStruct } from '../base';
import { Bot } from '../bot';
import { ChannelPermissionsController } from '../controllers/ChannelPermissionsController';
import { GuildChannelInvitesController } from '../controllers/GuildChannelInvitesController';
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
  permissions?: Record<Snowflake, PermissionOverwriteFlags & { type: PermissibleType }>;

  /**
   * The ID of the parent category for the channel
   */
  parentId?: Snowflake;
}

/**
 * Represents a channel found in a guild of any type
 */
export class GuildChannel extends Channel {
  /**
   * The guild this channel is associated to
   */
  public guild: Guild;

  /**
   * Sorting position of the channel
   */
  public position!: number;

  /**
   * This guild channel's permission overwrites controller
   */
  public permissions!: ChannelPermissionsController;

  /**
   * The name of the channel
   */
  public name!: string;

  /**
   * The topic of the channel.
   * Possibly null if channel does not have a topic
   */
  public topic!: string | null;

  /**
   * The guild channel's invites controller
   */
  public invites: GuildChannelInvitesController;

  /**
   * The ID of this channel's parent category
   */
  public parentId: Snowflake | undefined | null;

  constructor(bot: Bot, guildChannel: GatewayStruct, guild: Guild) {
    super(bot, guildChannel);

    this.guild = guild;

    this.invites = new GuildChannelInvitesController(this);
  }

  /**
   * @ignore
   * @param {GatewayStruct} guildChannel The guild channel data
   * @returns {this}
   */
  public init(guildChannel: GatewayStruct): this {
    super.init(guildChannel);

    this.position = guildChannel.position;

    this.permissions = new ChannelPermissionsController(this);

    if (guildChannel.permission_overwrites) {
      this.permissions.cache.addMany(
        guildChannel.permission_overwrites.map(
          (permission: GatewayStruct) => new PermissionOverwrite(this.bot, permission, this),
        ),
      );
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
  public get parent(): GuildCategoryChannel | null {
    if (!this.parentId) return null;

    return (this.guild.channels.cache.get(this.parentId) as GuildCategoryChannel) || null;
  }

  /**
   * Update a channel's settings. Requires the {@link Permission.ManageChannels} permission for the guild.
   * @param {GuildChannelOptions} options The modified channel's settings
   * @returns {Promise<GuildChannel>}
   */
  public modify(options: GuildChannelOptions): Promise<GuildChannel> {
    return this.bot.api.modifyGuildChannel(this.id, options);
  }
}
