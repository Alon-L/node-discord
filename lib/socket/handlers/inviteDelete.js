"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channels_1 = require("../../structures/channels");
const constants_1 = require("../constants");
exports.default = async ({ d }, bot) => {
    const { guild_id: guildId, channel_id: channelId, code } = d;
    const guild = await bot.guilds.get(guildId);
    const channel = await bot.channels.get(channelId);
    const invite = (guild === null || guild === void 0 ? void 0 : guild.invites.cache.get(code)) || {
        channelId: channelId,
        guild,
        code,
    };
    // Delete the invite from the guild's invites cache
    guild === null || guild === void 0 ? void 0 : guild.invites.cache.delete(code);
    if (channel instanceof channels_1.GuildChannel) {
        // Delete the invite from the guild channel's invites cache
        channel.invites.cache.delete(invite.code);
    }
    bot.events.emit(constants_1.BotEvent.InviteDelete, invite);
};
