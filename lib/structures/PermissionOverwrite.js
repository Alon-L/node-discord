"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionOverwrite = void 0;
const base_1 = require("./base");
const flags_1 = require("./flags");
/**
 * A full permission overwrite entry.
 * Contains full data about a guild channel's permission overwrite for a user or a role
 */
class PermissionOverwrite extends base_1.BaseStruct {
    constructor(bot, permission, channel) {
        super(bot, permission);
        this.channel = channel;
        this.init(permission);
    }
    /**
     * @ignore
     * @param {GatewayStruct} permission The permission data
     * @returns {this}
     */
    init(permission) {
        this.flags = {
            allow: new flags_1.PermissionFlags(permission.allow_new),
            deny: new flags_1.PermissionFlags(permission.deny_new),
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
    get id() {
        return this.permissible.id;
    }
}
exports.PermissionOverwrite = PermissionOverwrite;
