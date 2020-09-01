"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildTextChannel = void 0;
const GuildChannel_1 = require("./GuildChannel");
const channel_1 = require("../../controllers/channel");
const Timestamp_1 = require("../Timestamp");
/**
 * Represents a channel found in a guild of type {@link ChannelType.GuildText}
 */
class GuildTextChannel extends GuildChannel_1.GuildChannel {
    // Guild parameter used when creating the channel from the Guild constructor
    constructor(bot, textChannel, guild) {
        super(bot, textChannel, guild);
        this.messages = new channel_1.ChannelMessagesController(this);
    }
    /**
     * @ignore
     * @param {GatewayStruct} textChannel The text channel data
     * @returns {this}
     */
    init(textChannel) {
        super.init(textChannel);
        this.pins = new channel_1.ChannelPinsController(this);
        this.nsfw = textChannel.nsfw;
        this.lastMessageId = textChannel.last_message_id;
        this.slowModeTimeout = textChannel.rate_limit_per_user;
        this.pins.lastPinTimestamp = new Timestamp_1.Timestamp(textChannel.last_pin_timestamp);
        return this;
    }
    /** @inheritDoc */
    sendMessage(data, options) {
        return this.bot.api.sendMessage(this.id, data, options);
    }
    /**
     * Deletes multiple messages in a single request.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake[]} messages An array of the messages IDs you wish to delete
     * @returns {Promise<void>}
     */
    bulkDeleteMessages(messages) {
        return this.bot.api.bulkDeleteMessages(this.id, messages);
    }
    /** @inheritDoc */
    triggerTyping() {
        return this.bot.api.triggerTextChannelTyping(this.id);
    }
}
exports.GuildTextChannel = GuildTextChannel;
