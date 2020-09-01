"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceState = void 0;
const base_1 = require("../base");
var MUTE_STATE;
(function (MUTE_STATE) {
    MUTE_STATE[MUTE_STATE["SELF"] = 0] = "SELF";
    MUTE_STATE[MUTE_STATE["FORCE"] = 1] = "FORCE";
    MUTE_STATE[MUTE_STATE["NONE"] = 2] = "NONE";
})(MUTE_STATE || (MUTE_STATE = {}));
class VoiceState extends base_1.BaseStruct {
    constructor(bot, member, voiceState) {
        super(bot, voiceState);
        this.member = member;
        this.init(voiceState);
    }
    init(voiceState) {
        if (voiceState.self_mute)
            this.muted = MUTE_STATE.SELF;
        else if (voiceState.mute)
            this.muted = MUTE_STATE.FORCE;
        else
            this.muted = MUTE_STATE.NONE;
        if (voiceState.self_deaf)
            this.deafen = MUTE_STATE.SELF;
        else if (voiceState.deaf)
            this.deafen = MUTE_STATE.FORCE;
        else
            this.deafen = MUTE_STATE.NONE;
        this.channelId = voiceState.channel_id;
        return this;
    }
    get currentChannel() {
        const channel = this.bot.channels.cache.get(this.channelId);
        return channel ? channel : null;
    }
}
exports.VoiceState = VoiceState;
VoiceState.MUTE_STATE = MUTE_STATE;
