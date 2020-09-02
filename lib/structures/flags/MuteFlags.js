"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteFlags = exports.MUTE_STATE = void 0;
const Flags_1 = require("./Flags");
var MUTE_STATE;
(function (MUTE_STATE) {
    MUTE_STATE[MUTE_STATE["SELF"] = 4] = "SELF";
    MUTE_STATE[MUTE_STATE["FORCE"] = 2] = "FORCE";
})(MUTE_STATE = exports.MUTE_STATE || (exports.MUTE_STATE = {}));
class MuteFlags extends Flags_1.Flags {
    // Mute flags are the states of mutes and deafens
    constructor(flags) {
        super(flags);
    }
}
exports.MuteFlags = MuteFlags;
