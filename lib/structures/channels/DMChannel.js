"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMChannel = void 0;
const Channel_1 = require("./Channel");
const channel_1 = require("../../controllers/channel");
const Timestamp_1 = require("../Timestamp");
const User_1 = require("../User");
/**
 * Represents a private channel between the Bot and a User
 */
class DMChannel extends Channel_1.Channel {
    constructor(bot, dmChannel) {
        super(bot, dmChannel);
        this.messages = new channel_1.ChannelMessagesController(this);
    }
    /**
     * @ignore
     * @param {GatewayStruct} dmChannel The DM channel data
     * @returns {this}
     */
    init(dmChannel) {
        super.init(dmChannel);
        this.pins = new channel_1.ChannelPinsController(this);
        this.lastMessageId = dmChannel.last_message_id;
        this.pins.lastPinTimestamp = new Timestamp_1.Timestamp(dmChannel.last_pin_timestamp);
        this.recipient = new User_1.User(this.bot, dmChannel.recipients[0]);
        return this;
    }
    /** @inheritDoc */
    sendMessage(data, options) {
        return this.bot.api.sendMessage(this.id, data, options);
    }
    /** @inheritDoc */
    triggerTyping() {
        return this.bot.api.triggerTextChannelTyping(this.id);
    }
}
exports.DMChannel = DMChannel;
