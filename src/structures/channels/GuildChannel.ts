import Channel, { ChannelType } from './Channel';
import GuildCategoryChannel from './GuildCategoryChannel';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import { GatewayStruct } from '../BaseStruct';
import Bot from '../bot/Bot';
import GuildChannelInvitesController from '../controllers/GuildChannelInvitesController';
import PermissionFlags, {
  PermissionOverwriteFlags,
  Permissible,
  PermissionOverwrite,
} from '../flags/PermissionFlags';
import Guild from '../guild/Guild';

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
 * Represents a channel found in a guild of any type
 */
class GuildChannel extends Channel {
  /**
   * The guild this channel is associated to
   */
  public guild: Guild;

  /**
   * Sorting position of the channel
   */
  public position!: number;

  // TODO: Permission overwrites field
  public permissions!: Cluster<Snowflake, PermissionOverwrite>;

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

    // Serialize the received permission overwrites
    this.permissions = new Cluster<Snowflake, PermissionOverwrite>(
      guildChannel.permission_overwrites?.map(({ id, type, allow, deny }: GatewayStruct) => [
        id,
        {
          type,
          allow: new PermissionFlags(allow),
          deny: new PermissionFlags(deny),
        },
      ]),
    );

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

    const parent = this.guild.channels.get(this.parentId);

    return parent instanceof GuildCategoryChannel ? parent : null;
  }

  /**
   * Update a channel's settings. Requires the {@link Permission.ManageChannels} permission for the guild.
   * @param {GuildChannelOptions} options The modified channel's settings
   * @returns {Promise<GuildChannel>}
   */
  public modify(options: GuildChannelOptions): Promise<GuildChannel> {
    return this.bot.api.modifyGuildChannel(this.id, options);
  }

  /**
   * Modifies the channel permission overwrites for a member or a role.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Permissible} permissible Data for the member or role
   * @param {PermissionOverwriteFlags} permissions The permissions you wish to modify
   * @returns {Promise<void>}
   */
  public modifyPermissions(
    permissible: Permissible,
    permissions: PermissionOverwriteFlags,
  ): Promise<void> {
    return this.bot.api.modifyGuildChannelPermissions(this.id, permissible, permissions);
  }

  /**
   * Deletes a channel permission overwrite for a user or role in a guild channel.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} permissible The ID of the user or role you wish to delete from the channel's permission overwrites
   * @returns {Promise<void>}
   */
  public deletePermission(permissible: Snowflake): Promise<void> {
    return this.bot.api.deleteGuildChannelPermission(this.id, permissible);
  }
}

export default GuildChannel;
