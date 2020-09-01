"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
/**
 * Represents a Voice channel
 */
class GuildVoiceChannel extends __1.GuildChannel {
    constructor(bot, guildChannel, guild) {
        super(bot, guildChannel, guild);
    }
    join(mute, deaf) {
        return this.guild.voice.join(this.id, { mute, deaf });
    }
}
exports.default = GuildVoiceChannel;
