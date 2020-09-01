"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelPermissionsController = void 0;
const base_1 = require("../base");
/**
 * Interface for a guild channel's permission overwrites cache.
 * The permission overwrites are mapped by their Permissible's ID
 */
class ChannelPermissionsController extends base_1.BaseDeleteController {
    constructor(channel) {
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
    modify(permissible, flags) {
        return this.bot.api.modifyGuildChannelPermissions(this.channel.id, permissible, flags);
    }
    /**
     * Deletes a channel permission overwrite for a user or role in a guild channel.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} id The ID of the user or role you wish to delete from the channel's permission overwrites
     * @returns {Promise<void>}
     */
    delete(id) {
        return this.bot.api.deleteGuildChannelPermission(this.channel.id, id);
    }
}
exports.ChannelPermissionsController = ChannelPermissionsController;
