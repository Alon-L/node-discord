"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceActivityFlags = exports.PresenceActivity = void 0;
const Flags_1 = require("./Flags");
/**
 * All Discord presence activity flags
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-flags
 */
var PresenceActivity;
(function (PresenceActivity) {
    PresenceActivity[PresenceActivity["Instance"] = 1] = "Instance";
    PresenceActivity[PresenceActivity["Join"] = 2] = "Join";
    PresenceActivity[PresenceActivity["Spectate"] = 4] = "Spectate";
    PresenceActivity[PresenceActivity["JoinRequest"] = 8] = "JoinRequest";
    PresenceActivity[PresenceActivity["Sync"] = 16] = "Sync";
    PresenceActivity[PresenceActivity["Play"] = 32] = "Play";
})(PresenceActivity = exports.PresenceActivity || (exports.PresenceActivity = {}));
class PresenceActivityFlags extends Flags_1.Flags {
}
exports.PresenceActivityFlags = PresenceActivityFlags;
