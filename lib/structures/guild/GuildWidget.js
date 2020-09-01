"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildWidget = void 0;
const base_1 = require("../base");
/**
 * Guild widget object
 */
class GuildWidget extends base_1.BaseGuildStruct {
    constructor(bot, widget, guild) {
        super(bot, guild, widget);
        this.init(widget);
    }
    init(widget) {
        this.enabled = widget.enabled;
        this.channel = this.guild.channels.cache.get(widget.channel_id);
        return this;
    }
    /**
     * Modifies this guild widget.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {ModifyWidgetOptions} options The options for the updated guild widget
     * @returns {Promise<GuildWidget>} The updated guild widget
     */
    modify(options) {
        return this.bot.api.modifyGuildWidget(this.guild.id, options);
    }
}
exports.GuildWidget = GuildWidget;
