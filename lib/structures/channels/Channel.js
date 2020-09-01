"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = exports.ChannelType = void 0;
const base_1 = require("../base");
/**
 * The type of a channel
 */
var ChannelType;
(function (ChannelType) {
    ChannelType[ChannelType["GuildText"] = 0] = "GuildText";
    ChannelType[ChannelType["DM"] = 1] = "DM";
    ChannelType[ChannelType["GuildVoice"] = 2] = "GuildVoice";
    ChannelType[ChannelType["GroupDM"] = 3] = "GroupDM";
    ChannelType[ChannelType["GuildCategory"] = 4] = "GuildCategory";
    ChannelType[ChannelType["GuildNews"] = 5] = "GuildNews";
    ChannelType[ChannelType["GuildStore"] = 6] = "GuildStore";
})(ChannelType = exports.ChannelType || (exports.ChannelType = {}));
/**
 * Represents a guild or DM channel within Discord.
 */
class Channel extends base_1.BaseStruct {
    constructor(bot, channel) {
        super(bot, channel);
        this.init(channel);
    }
    /**
     * @ignore
     * @param {GatewayStruct} channel The channel data
     * @returns {this}
     */
    init(channel) {
        this.id = channel.id;
        this.type = channel.type;
        return this;
    }
    /**
     * Deletes a {@link GuildChannel}, or closes a {@link DMChannel}. Requires the {@link Permission.ManageChannels} permission for the guild
     * @returns {Promise<Channel>}
     */
    delete() {
        return this.bot.api.deleteChannel(this.id);
    }
    /**
     * @ignore
     * @returns {string}
     */
    toString() {
        return `<#${this.id}>`;
    }
}
exports.Channel = Channel;
