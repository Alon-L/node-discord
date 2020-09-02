"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const VoiceState_1 = require("../../structures/voice/VoiceState");
exports.default = async ({ d }, bot) => {
    const oldVoiceState = bot.guilds.cache.get(d.guild_id).voiceStates.get(d.user_id);
    const newVoiceState = new VoiceState_1.VoiceState(bot, bot.guilds.cache.get(d.guild_id).members.cache.get(d.user_id), d);
    bot.events.emit(__1.BotEvent.VoiceStateUpdate, oldVoiceState, newVoiceState);
    bot.guilds.cache.get(d.guild_id).voiceStates.set(d.user_id, newVoiceState);
};
