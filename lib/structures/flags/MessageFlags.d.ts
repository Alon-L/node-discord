import { Flags } from './Flags';
/**
 * All message flags
 * https://discord.com/developers/docs/resources/channel#message-object-message-flags
 */
export declare enum MessageFlag {
    /**
     * This message has been published to subscribed channels (via Channel Following)
     */
    Crossposted = 1,
    /**
     * This message originated from a message in another channel (via Channel Following)
     */
    IsCrosspost = 2,
    /**
     * Do not include any embeds when serializing this message
     */
    SuppressEmbeds = 4,
    /**
     * The source message for this crosspost has been deleted (via Channel Following)
     */
    SourceMessageDeleted = 8,
    /**
     * This message came from the urgent message system
     */
    Urgent = 16
}
export declare class MessageFlags extends Flags<MessageFlag> {
}
