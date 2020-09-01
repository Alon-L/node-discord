"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageFlags = exports.MessageFlag = void 0;
const Flags_1 = require("./Flags");
/**
 * All message flags
 * https://discord.com/developers/docs/resources/channel#message-object-message-flags
 */
var MessageFlag;
(function (MessageFlag) {
    /**
     * This message has been published to subscribed channels (via Channel Following)
     */
    MessageFlag[MessageFlag["Crossposted"] = 1] = "Crossposted";
    /**
     * This message originated from a message in another channel (via Channel Following)
     */
    MessageFlag[MessageFlag["IsCrosspost"] = 2] = "IsCrosspost";
    /**
     * Do not include any embeds when serializing this message
     */
    MessageFlag[MessageFlag["SuppressEmbeds"] = 4] = "SuppressEmbeds";
    /**
     * The source message for this crosspost has been deleted (via Channel Following)
     */
    MessageFlag[MessageFlag["SourceMessageDeleted"] = 8] = "SourceMessageDeleted";
    /**
     * This message came from the urgent message system
     */
    MessageFlag[MessageFlag["Urgent"] = 16] = "Urgent";
})(MessageFlag = exports.MessageFlag || (exports.MessageFlag = {}));
class MessageFlags extends Flags_1.Flags {
}
exports.MessageFlags = MessageFlags;
