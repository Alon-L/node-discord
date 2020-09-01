"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFlags = exports.UserFlag = void 0;
const Flags_1 = require("./Flags");
/**
 * All Discord user flags (profile badges)
 * https://discord.com/developers/docs/resources/user#user-object-user-flags
 */
var UserFlag;
(function (UserFlag) {
    UserFlag[UserFlag["None"] = 0] = "None";
    UserFlag[UserFlag["DiscordEmployee"] = 1] = "DiscordEmployee";
    UserFlag[UserFlag["DiscordPartner"] = 2] = "DiscordPartner";
    UserFlag[UserFlag["HypeSquadEvents"] = 4] = "HypeSquadEvents";
    UserFlag[UserFlag["BugHunterLevel1"] = 8] = "BugHunterLevel1";
    UserFlag[UserFlag["HouseBravery"] = 64] = "HouseBravery";
    UserFlag[UserFlag["HouseBrilliance"] = 128] = "HouseBrilliance";
    UserFlag[UserFlag["HouseBalance"] = 256] = "HouseBalance";
    UserFlag[UserFlag["EarlySupporter"] = 512] = "EarlySupporter";
    UserFlag[UserFlag["TeamUser"] = 1024] = "TeamUser";
    UserFlag[UserFlag["System"] = 4096] = "System";
    UserFlag[UserFlag["BugHunterLevel2"] = 16384] = "BugHunterLevel2";
    UserFlag[UserFlag["VerifiedBot"] = 65536] = "VerifiedBot";
    UserFlag[UserFlag["VerifiedBotDeveloper"] = 131072] = "VerifiedBotDeveloper";
})(UserFlag = exports.UserFlag || (exports.UserFlag = {}));
class UserFlags extends Flags_1.Flags {
}
exports.UserFlags = UserFlags;
