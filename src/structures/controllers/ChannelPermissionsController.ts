import BaseDeleteController from './base/BaseDeleteController';
import { Snowflake } from '../../types/types';
import PermissionOverwrite from '../PermissionOverwrite';
import GuildChannel from '../channels/GuildChannel';
import { Permissible, PermissionOverwriteFlags } from '../flags/PermissionFlags';

/**
 * Interface for a guild channel's permission overwrites cache.
 * The permission overwrites are mapped by their Permissible's ID
 */
class ChannelPermissionsController extends BaseDeleteController<PermissionOverwrite> {
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
  public async modify(
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
  public async delete(id: Snowflake): Promise<void> {
    return this.bot.api.deleteGuildChannelPermission(this.channel.id, id);
  }
}

export default ChannelPermissionsController;
