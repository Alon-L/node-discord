import { PermissionOverwrite } from '../../structures';
import { GuildChannel } from '../../structures/channels';
import { Permissible, PermissionOverwriteFlags } from '../../structures/flags';
import { Snowflake } from '../../types';
import { BaseDeleteController } from '../base';
/**
 * Interface for a guild channel's permission overwrites cache.
 * The permission overwrites are mapped by their Permissible's ID
 */
export declare class ChannelPermissionsController extends BaseDeleteController<PermissionOverwrite> {
    /**
     * The guild channel this controller is associated to
     */
    channel: GuildChannel;
    constructor(channel: GuildChannel);
    /**
     * Modifies the channel permission overwrites for a member or a role.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Permissible} permissible Data for the member or role
     * @param {PermissionOverwriteFlags} flags The permissions flags you wish to modify
     * @returns {Promise<void>}
     */
    modify(permissible: Permissible, flags: PermissionOverwriteFlags): Promise<PermissionOverwrite>;
    /**
     * Deletes a channel permission overwrite for a user or role in a guild channel.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} id The ID of the user or role you wish to delete from the channel's permission overwrites
     * @returns {Promise<void>}
     */
    delete(id: Snowflake): Promise<void>;
}
