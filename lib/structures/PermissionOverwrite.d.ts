import { BaseStruct, GatewayStruct } from './base';
import { GuildChannel } from './channels';
import { Permissible, PermissionOverwriteFlags } from './flags';
import { Bot } from '../bot';
/**
 * A full permission overwrite entry.
 * Contains full data about a guild channel's permission overwrite for a user or a role
 */
export declare class PermissionOverwrite extends BaseStruct {
    /**
     * The channel this overwrite is associated to
     */
    readonly channel: GuildChannel;
    /**
     * The permission flags of this permission overwrite
     */
    flags: Required<PermissionOverwriteFlags>;
    /**
     * The user or role this permission overwrite is for
     */
    permissible: Permissible;
    constructor(bot: Bot, permission: GatewayStruct, channel: GuildChannel);
    /**
     * @ignore
     * @param {GatewayStruct} permission The permission data
     * @returns {this}
     */
    init(permission: GatewayStruct): this;
    /**
     * The permissible's ID.
     * Servers as an identifier for this permission overwrite
     * @type {string}
     */
    get id(): string;
}
