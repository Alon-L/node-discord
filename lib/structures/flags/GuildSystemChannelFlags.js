"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSystemChannelFlags = exports.SystemChannelFlag = void 0;
const Flags_1 = require("./Flags");
/**
 * All guild system channel flags
 * https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
 */
var SystemChannelFlag;
(function (SystemChannelFlag) {
    /**
     * Suppress member join notifications
     */
    SystemChannelFlag[SystemChannelFlag["SuppressJoinNotifications"] = 1] = "SuppressJoinNotifications";
    /**
     * Suppress server boost notifications
     */
    SystemChannelFlag[SystemChannelFlag["SuppressBoosts"] = 2] = "SuppressBoosts";
})(SystemChannelFlag = exports.SystemChannelFlag || (exports.SystemChannelFlag = {}));
class GuildSystemChannelFlags extends Flags_1.Flags {
}
exports.GuildSystemChannelFlags = GuildSystemChannelFlags;
