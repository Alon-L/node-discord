import { BaseStruct, GatewayStruct } from './base';
import { Bot } from './bot';
import { GuildChannel } from './channels';
import { PermissionFlags, Permissible, PermissionOverwriteFlags } from './flags';

/**
 * A full permission overwrite entry.
 * Contains full data about a guild channel's permission overwrite for a user or a role
 */
export class PermissionOverwrite extends BaseStruct {
  /**
   * The channel this overwrite is associated to
   */
  public readonly channel: GuildChannel;

  /**
   * The permission flags of this permission overwrite
   */
  public flags!: Required<PermissionOverwriteFlags>;

  /**
   * The user or role this permission overwrite is for
   */
  public permissible!: Permissible;

  constructor(bot: Bot, permission: GatewayStruct, channel: GuildChannel) {
    super(bot, permission);

    this.channel = channel;

    this.init(permission);
  }

  /**
   * @ignore
   * @param {GatewayStruct} permission The permission data
   * @returns {this}
   */
  public init(permission: GatewayStruct): this {
    this.flags = {
      allow: new PermissionFlags(permission.allow_new),
      deny: new PermissionFlags(permission.deny_new),
    };

    this.permissible = {
      id: permission.id,
      type: permission.type,
    };

    return this;
  }

  /**
   * The permissible's ID.
   * Servers as an identifier for this permission overwrite
   * @type {string}
   */
  public get id(): string {
    return this.permissible.id;
  }
}
