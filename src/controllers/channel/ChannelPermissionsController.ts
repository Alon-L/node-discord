import { PermissionOverwrite } from '../../structures';
import { GuildChannel } from '../../structures/channels';
import { Permissible, PermissionOverwriteFlags } from '../../structures/flags';
import { Snowflake } from '../../types';
import { BaseDeleteController } from '../base';

/**
 * Interface for a guild channel's permission overwrites cache.
 * The permission overwrites are mapped by their Permissible's ID
 */
export class ChannelPermissionsController extends BaseDeleteController<PermissionOverwrite> {
  /**
   * The guild channel this controller is associated to
   */
  public channel: GuildChannel;

  constructor(channel: GuildChannel) {
    super(channel);

    this.channel = channel;
  }

  /**
   * Modifies the channel permission overwrites for a member or a role.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Permissible} permissible Data for the member or role
   * @param {PermissionOverwriteFlags} flags The permissions flags you wish to modify
   * @returns {Promise<void>}
   */
  public modify(
    permissible: Permissible,
    flags: PermissionOverwriteFlags,
  ): Promise<PermissionOverwrite> {
    return this.bot.api.modifyGuildChannelPermissions(this.channel.id, permissible, flags);
  }

  /**
   * Deletes a channel permission overwrite for a user or role in a guild channel.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} id The ID of the user or role you wish to delete from the channel's permission overwrites
   * @returns {Promise<void>}
   */
  public delete(id: Snowflake): Promise<void> {
    return this.bot.api.deleteGuildChannelPermission(this.channel.id, id);
  }
}
