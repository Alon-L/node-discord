import { GuildChannel } from './GuildChannel';
import { TextChannel } from './TextChannel';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import { Timestamp } from '../Timestamp';
import { Bot } from '../bot';
import { ChannelMessagesController, ChannelPinsController } from '../controllers';
import { Guild } from '../guild';
import { Message, MessageOptions, MessageData, MessageEmbed } from '../message';

/**
 * Represents a channel found in a guild of type {@link ChannelType.GuildText}
 */
export class GuildTextChannel extends GuildChannel implements TextChannel {
  /** @inheritDoc */
  public nsfw: boolean | undefined;

  /** @inheritDoc */
  public lastMessageId: Snowflake | null | undefined;

  /** @inheritDoc */
  public slowModeTimeout!: number;

  /** @inheritDoc */
  public messages: ChannelMessagesController;

  /** @inheritDoc */
  public pins!: ChannelPinsController;

  // Guild parameter used when creating the channel from the Guild constructor
  constructor(bot: Bot, textChannel: GatewayStruct, guild: Guild) {
    super(bot, textChannel, guild);

    this.messages = new ChannelMessagesController(this);
  }

  /**
   * @ignore
   * @param {GatewayStruct} textChannel The text channel data
   * @returns {this}
   */
  public init(textChannel: GatewayStruct): this {
    super.init(textChannel);

    this.pins = new ChannelPinsController(this);

    this.nsfw = textChannel.nsfw;
    this.lastMessageId = textChannel.last_message_id;
    this.slowModeTimeout = textChannel.rate_limit_per_user;

    this.pins.lastPinTimestamp = new Timestamp(textChannel.last_pin_timestamp);

    return this;
  }

  /** @inheritDoc */
  public sendMessage(
    data: string | MessageData | MessageEmbed,
    options?: MessageOptions,
  ): Promise<Message> {
    return this.bot.api.sendMessage(this.id, data, options);
  }

  /**
   * Deletes multiple messages in a single request.
   * Requires the {@link Permission.ManageMessages} permission
   * @param {Snowflake[]} messages An array of the messages IDs you wish to delete
   * @returns {Promise<void>}
   */
  public bulkDeleteMessages(messages: Snowflake[]): Promise<void> {
    return this.bot.api.bulkDeleteMessages(this.id, messages);
  }

  /** @inheritDoc */
  public triggerTyping(): Promise<void> {
    return this.bot.api.triggerTextChannelTyping(this.id);
  }
}
