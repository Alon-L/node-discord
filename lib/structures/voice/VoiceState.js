"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceState = void 0;
const base_1 = require("../base");
const MuteFlags_1 = require("../flags/MuteFlags");
class VoiceState extends base_1.BaseStruct {
    constructor(bot, member, voiceState) {
        super(bot, voiceState);
        this.member = member;
        this.init(voiceState);
    }
    init(voiceState) {
        if (voiceState.self_mute)
            this.muted = new MuteFlags_1.MuteFlags(MuteFlags_1.MuteState.SELF);
        if (voiceState.mute)
            this.muted = new MuteFlags_1.MuteFlags(MuteFlags_1.MuteState.FORCE);
        if (voiceState.self_deaf)
            new MuteFlags_1.MuteFlags(MuteFlags_1.MuteState.SELF);
        if (voiceState.deaf)
            this.deafen = new MuteFlags_1.MuteFlags(MuteFlags_1.MuteState.FORCE);
        this.channelId = voiceState.channel_id;
        this.sessionId = voiceState.session_id;
        return this;
    }
    isOnVoice() {
        return !!this.sessionId;
    }
    get currentChannel() {
        const channel = this.bot.channels.cache.get(this.channelId);
        return channel ? channel : null;
    }
}
exports.VoiceState = VoiceState;
