"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = __importDefault(require("./Connection"));
const socket_1 = require("../../socket");
/**
 * Represents a voice connection of a guild
 */
class GuildVoice {
    constructor(guild) {
        this.connection = new Connection_1.default(this);
        this.guild = guild;
        this.bot = guild.bot;
    }
    join(channelId, options) {
        this.guild.shard.send({
            op: 2,
            d: {
                guild_id: this.guild.id,
                channel_id: channelId,
                self_mute: !!options.mute,
                self_deaf: !!options.deaf,
            },
        });
        return new Promise(resolve => {
            const listener = ((guild, voiceServer) => {
                if (guild.id === this.guild.id) {
                    this.connection.endpoint = voiceServer.endpoint;
                    this.connection.token = voiceServer.token;
                    this.bot.events.removeListener(socket_1.BotEvent.VoiceServerUpdate, listener);
                    resolve(this.connection);
                }
            }).bind(this);
            this.bot.events.on(socket_1.BotEvent.VoiceServerUpdate, listener);
        });
    }
}
exports.default = GuildVoice;
