"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildCategoryChannel = void 0;
const GuildChannel_1 = require("./GuildChannel");
/**
 * Represents a channel found in a guild of type {@link ChannelType.GuildCategory}
 */
class GuildCategoryChannel extends GuildChannel_1.GuildChannel {
    /**
     * Returns all {@link GuildChannel}s under this category channel
     * @type {Collection<Snowflake, GuildChannel>}
     */
    get children() {
        return this.guild.channels.cache.filter(c => { var _a; return ((_a = c.parent) === null || _a === void 0 ? void 0 : _a.id) === this.id; });
    }
}
exports.GuildCategoryChannel = GuildCategoryChannel;
