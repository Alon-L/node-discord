"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageAttachment = void 0;
const base_1 = require("../base");
/**
 * Represents an attachment added to a {@link Message}

 * @extends BaseStruct
 */
class MessageAttachment extends base_1.BaseStruct {
    constructor(message, attachment) {
        super(message.bot, attachment);
        this.message = message;
        this.init(attachment);
    }
    /**
     * @ignore
     * @param {GatewayStruct} attachment The attachment data
     * @returns {this}
     */
    init(attachment) {
        this.id = attachment.id;
        this.filename = attachment.filename;
        this.size = attachment.size;
        this.url = attachment.url;
        this.proxyURL = attachment.proxy_url;
        this.dimensions = {
            height: attachment.height,
            width: attachment.width,
        };
        return this;
    }
}
exports.MessageAttachment = MessageAttachment;
