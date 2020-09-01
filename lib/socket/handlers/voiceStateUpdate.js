"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const VoiceState_1 = __importDefault(require("../../structures/voice/VoiceState"));
exports.default = ({ d }, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const oldVoiceState = bot.guilds.cache.get(d.guild_id).voiceStates.get(d.user_id);
    const newVoiceState = new VoiceState_1.default(bot, oldVoiceState.member, d);
    bot.events.emit(__1.BotEvent.VoiceStateUpdate, oldVoiceState, newVoiceState);
    bot.guilds.cache.get(d.guild_id).voiceStates.set(d.user_id, newVoiceState);
});
