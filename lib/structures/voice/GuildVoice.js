"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildVoice = void 0;
const Connection_1 = require("./Connection");
const socket_1 = require("../../socket");
/**
 * Represents a voice connection of a guild
 */
class GuildVoice {
    constructor(guild) {
        this.connection = new Connection_1.Connection(this);
        this.guild = guild;
        this.bot = guild.bot;
    }
    join(channelId, options) {
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
            this.bot.connection.shards.first.send({
                op: 4,
                d: {
                    guild_id: this.guild.id,
                    channel_id: channelId,
                    self_mute: !!options.mute,
                    self_deaf: !!options.deaf,
                },
            });
        });
    }
}
exports.GuildVoice = GuildVoice;
