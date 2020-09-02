"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildVoiceChannel = void 0;
const GuildChannel_1 = require("./GuildChannel");
/**
 * Represents a Voice channel
 */
class GuildVoiceChannel extends GuildChannel_1.GuildChannel {
    constructor(bot, guildChannel, guild) {
        super(bot, guildChannel, guild);
    }
    join(mute, deaf) {
        return this.guild.voice.join(this.id, { mute, deaf });
    }
}
exports.GuildVoiceChannel = GuildVoiceChannel;
