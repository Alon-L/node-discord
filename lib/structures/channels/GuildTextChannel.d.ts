import { GuildChannel } from './GuildChannel';
import { TextChannel } from './TextChannel';
import { Bot } from '../../bot';
import { ChannelMessagesController, ChannelPinsController } from '../../controllers/channel';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../base';
import { Guild } from '../guild';
import { Message, MessageOptions, MessageData, MessageEmbed } from '../message';
/**
 * Represents a channel found in a guild of type {@link ChannelType.GuildText}
 */
export declare class GuildTextChannel extends GuildChannel implements TextChannel {
    /** @inheritDoc */
    nsfw: boolean | undefined;
    /** @inheritDoc */
    lastMessageId: Snowflake | null | undefined;
    /** @inheritDoc */
    slowModeTimeout: number;
    /** @inheritDoc */
    messages: ChannelMessagesController;
    /** @inheritDoc */
    pins: ChannelPinsController;
    constructor(bot: Bot, textChannel: GatewayStruct, guild: Guild);
    /**
     * @ignore
     * @param {GatewayStruct} textChannel The text channel data
     * @returns {this}
     */
    init(textChannel: GatewayStruct): this;
    /** @inheritDoc */
    sendMessage(data: string | MessageData | MessageEmbed, options?: MessageOptions): Promise<Message>;
    /**
     * Deletes multiple messages in a single request.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake[]} messages An array of the messages IDs you wish to delete
     * @returns {Promise<void>}
     */
    bulkDeleteMessages(messages: Snowflake[]): Promise<void>;
    /** @inheritDoc */
    triggerTyping(): Promise<void>;
}
