"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const base_1 = require("./base");
const flags_1 = require("./flags");
/**
 * Represents a role in a guild
 */
class Role extends base_1.BaseGuildStruct {
    constructor(bot, role, guild) {
        super(bot, guild, role);
        this.init(role);
    }
    /**
     * @ignore
     * @param {GatewayStruct} role The role data
     * @returns {this}
     */
    init(role) {
        this.id = role.id;
        this.name = role.name;
        this.color = role.color;
        this.listedSeparately = role.hoist;
        this.position = role.position;
        this.permissions = new flags_1.PermissionFlags(role.permissions_new);
        this.managed = role.managed;
        this.mentionable = role.mentionable;
        return this;
    }
    /**
     * Modifies this role.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {RoleOptions} options The options for the modified role
     * @returns {Promise<Role>} The updated role
     */
    modify(options) {
        return this.bot.api.modifyRole(this.guild.id, this.id, options);
    }
    /**
     * @ignore
     * @returns {string}
     */
    toString() {
        return `<@&${this.id}>`;
    }
}
exports.Role = Role;
