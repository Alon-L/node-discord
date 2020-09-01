import { Channel } from './Channel';
import { TextChannel } from './TextChannel';
import { Bot } from '../../bot';
import { ChannelMessagesController, ChannelPinsController } from '../../controllers/channel';
import { Snowflake } from '../../types';
import { User } from '../User';
import { GatewayStruct } from '../base';
import { Message, MessageData, MessageOptions, MessageEmbed } from '../message';
/**
 * Represents a private channel between the Bot and a User
 */
export declare class DMChannel extends Channel implements TextChannel {
    /** @inheritDoc */
    lastMessageId: Snowflake | null | undefined;
    /** @inheritDoc */
    messages: ChannelMessagesController;
    /** @inheritDoc */
    pins: ChannelPinsController;
    /**
     * The recipient of the DM
     */
    recipient: User;
    constructor(bot: Bot, dmChannel: GatewayStruct);
    /**
     * @ignore
     * @param {GatewayStruct} dmChannel The DM channel data
     * @returns {this}
     */
    init(dmChannel: GatewayStruct): this;
    /** @inheritDoc */
    sendMessage(data: string | MessageData | MessageEmbed, options?: MessageOptions): Promise<Message>;
    /** @inheritDoc */
    triggerTyping(): Promise<void>;
}
