"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteFlags = exports.MuteState = void 0;
const Flags_1 = require("./Flags");
var MuteState;
(function (MuteState) {
    MuteState[MuteState["SELF"] = 4] = "SELF";
    MuteState[MuteState["FORCE"] = 2] = "FORCE";
    MuteState[MuteState["NONE"] = 1] = "NONE";
})(MuteState = exports.MuteState || (exports.MuteState = {}));
class MuteFlags extends Flags_1.Flags {
}
exports.MuteFlags = MuteFlags;
