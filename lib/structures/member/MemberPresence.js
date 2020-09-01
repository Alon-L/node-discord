"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberPresence = exports.PresenceClientStatusIndicator = exports.PresenceStatus = exports.PresenceActivityType = void 0;
const Timestamp_1 = require("../Timestamp");
const base_1 = require("../base");
const flags_1 = require("../flags");
/**
 * The type of the presence activity
 */
var PresenceActivityType;
(function (PresenceActivityType) {
    PresenceActivityType[PresenceActivityType["Game"] = 0] = "Game";
    PresenceActivityType[PresenceActivityType["Streaming"] = 1] = "Streaming";
    PresenceActivityType[PresenceActivityType["Listening"] = 2] = "Listening";
    PresenceActivityType[PresenceActivityType["Custom"] = 3] = "Custom";
})(PresenceActivityType = exports.PresenceActivityType || (exports.PresenceActivityType = {}));
/**
 * The presence status of a member
 */
var PresenceStatus;
(function (PresenceStatus) {
    PresenceStatus["Idle"] = "idle";
    PresenceStatus["DND"] = "dnd";
    PresenceStatus["Online"] = "online";
    PresenceStatus["Invisible"] = "invisible";
    PresenceStatus["Offline"] = "offline";
})(PresenceStatus = exports.PresenceStatus || (exports.PresenceStatus = {}));
var PresenceClientStatusIndicator;
(function (PresenceClientStatusIndicator) {
    PresenceClientStatusIndicator["Online"] = "online";
    PresenceClientStatusIndicator["Idle"] = "idle";
    PresenceClientStatusIndicator["DND"] = "dnd";
})(PresenceClientStatusIndicator = exports.PresenceClientStatusIndicator || (exports.PresenceClientStatusIndicator = {}));
/**
 * A member's presence is their current state on a guild
 */
class MemberPresence extends base_1.BaseGuildStruct {
    constructor(bot, presence, member) {
        super(bot, member.guild, presence);
        this.member = member;
        this.init(presence);
    }
    /**
     * @ignore
     * @param {GatewayStruct} presence The presence data
     * @returns {this}
     */
    init(presence) {
        if (presence.game) {
            this.game = MemberPresence.parseActivity(presence.game);
        }
        this.status = presence.status;
        if (presence.activities) {
            this.activities = presence.activities.map((activity) => MemberPresence.parseActivity(activity));
        }
        this.clientStatus = presence.client_status;
        if (presence.premium_since) {
            this.boostingSince = new Timestamp_1.Timestamp(presence.premium_since);
        }
        this.nick = presence.nick;
        return this;
    }
    /**
     * Builds a {@link PresenceGame} object from a received gateway activity object
     * @param {GatewayStruct} activity The gateway activity object
     * @returns {PresenceGame}
     */
    static parseActivity(activity) {
        return {
            name: activity.name,
            type: activity.type,
            url: activity.url,
            createdAt: activity.created_at,
            timestamps: activity.timestamps,
            applicationId: activity.application_id,
            details: activity.details,
            state: activity.state,
            emoji: activity.emoji,
            party: activity.party,
            assets: activity.assets && {
                largeImage: activity.assets.large_image,
                largeText: activity.assets.large_text,
                smallImage: activity.assets.small_image,
                smallText: activity.assets.small_text,
            },
            secrets: activity.secrets,
            instance: activity.instance,
            flags: activity.flags && new flags_1.PresenceActivityFlags(activity.flags),
        };
    }
}
exports.MemberPresence = MemberPresence;
