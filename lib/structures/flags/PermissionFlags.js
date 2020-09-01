"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionFlags = exports.PermissibleType = exports.Permission = void 0;
const Flags_1 = require("./Flags");
/**
 * All Discord permission flags
 * https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
 */
var Permission;
(function (Permission) {
    Permission[Permission["CreateInstantInvite"] = 1] = "CreateInstantInvite";
    Permission[Permission["KickMembers"] = 2] = "KickMembers";
    Permission[Permission["BanMembers"] = 4] = "BanMembers";
    Permission[Permission["Administrator"] = 8] = "Administrator";
    Permission[Permission["ManageChannels"] = 16] = "ManageChannels";
    Permission[Permission["ManageGuild"] = 32] = "ManageGuild";
    Permission[Permission["AddReactions"] = 64] = "AddReactions";
    Permission[Permission["ViewAuditLog"] = 128] = "ViewAuditLog";
    Permission[Permission["PrioritySpeaker"] = 256] = "PrioritySpeaker";
    Permission[Permission["Stream"] = 512] = "Stream";
    Permission[Permission["ViewChannel"] = 1024] = "ViewChannel";
    Permission[Permission["SendMessages"] = 2048] = "SendMessages";
    Permission[Permission["SendTTSMessages"] = 4096] = "SendTTSMessages";
    Permission[Permission["ManageMessages"] = 8192] = "ManageMessages";
    Permission[Permission["EmbedLinks"] = 16384] = "EmbedLinks";
    Permission[Permission["AttachFiles"] = 32768] = "AttachFiles";
    Permission[Permission["ReadMessageHistory"] = 65536] = "ReadMessageHistory";
    Permission[Permission["MentionEveryone"] = 131072] = "MentionEveryone";
    Permission[Permission["UseExternalEmojis"] = 262144] = "UseExternalEmojis";
    Permission[Permission["ViewGuildInsights"] = 524288] = "ViewGuildInsights";
    Permission[Permission["Connect"] = 1048576] = "Connect";
    Permission[Permission["Speak"] = 2097152] = "Speak";
    Permission[Permission["MuteMembers"] = 4194304] = "MuteMembers";
    Permission[Permission["DeafenMembers"] = 8388608] = "DeafenMembers";
    Permission[Permission["MoveMembers"] = 16777216] = "MoveMembers";
    Permission[Permission["UseVAD"] = 33554432] = "UseVAD";
    Permission[Permission["ChangeNickname"] = 67108864] = "ChangeNickname";
    Permission[Permission["ManageNicknames"] = 134217728] = "ManageNicknames";
    Permission[Permission["ManageRoles"] = 268435456] = "ManageRoles";
    Permission[Permission["ManageWebhooks"] = 536870912] = "ManageWebhooks";
    Permission[Permission["ManageEmojis"] = 1073741824] = "ManageEmojis";
})(Permission = exports.Permission || (exports.Permission = {}));
/**
 * The type of the permission overwrite
 */
var PermissibleType;
(function (PermissibleType) {
    /**
     * The permission overwrite is for a member
     */
    PermissibleType["Member"] = "member";
    /**
     * The permission overwrite is for a role
     */
    PermissibleType["Role"] = "role";
})(PermissibleType = exports.PermissibleType || (exports.PermissibleType = {}));
class PermissionFlags extends Flags_1.Flags {
    // Permission flags in Discord are now received in serialized strings
    constructor(flags) {
        super(parseInt(flags));
    }
}
exports.PermissionFlags = PermissionFlags;
