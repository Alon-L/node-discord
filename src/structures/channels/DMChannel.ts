import { Channel } from './Channel';
import { TextChannel } from './TextChannel';
import { Snowflake } from '../../types';
import { Timestamp } from '../Timestamp';
import { User } from '../User';
import { GatewayStruct } from '../base';
import { Bot } from '../bot';
import { ChannelMessagesController } from '../controllers/ChannelMessagesController';
import { ChannelPinsController } from '../controllers/ChannelPinsController';
import { Message, MessageData, MessageOptions, MessageEmbed } from '../message';

/**
 * Represents a private channel between the Bot and a User
 */
export class DMChannel extends Channel implements TextChannel {
  /** @inheritDoc */
  public lastMessageId: Snowflake | null | undefined;

  /** @inheritDoc */
  public messages: ChannelMessagesController;

  /** @inheritDoc */
  public pins!: ChannelPinsController;

  /**
   * The recipient of the DM
   */
  public recipient!: User;

  constructor(bot: Bot, dmChannel: GatewayStruct) {
    super(bot, dmChannel);

    this.messages = new ChannelMessagesController(this);
  }

  /**
   * @ignore
   * @param {GatewayStruct} dmChannel The DM channel data
   * @returns {this}
   */
  public init(dmChannel: GatewayStruct): this {
    super.init(dmChannel);

    this.pins = new ChannelPinsController(this);

    this.lastMessageId = dmChannel.last_message_id;

    this.pins.lastPinTimestamp = new Timestamp(dmChannel.last_pin_timestamp);

    this.recipient = new User(this.bot, dmChannel.recipients[0]);

    return this;
  }

  /** @inheritDoc */
  public sendMessage(
    data: string | MessageData | MessageEmbed,
    options?: MessageOptions,
  ): Promise<Message> {
    return this.bot.api.sendMessage(this.id, data, options);
  }

  /** @inheritDoc */
  public triggerTyping(): Promise<void> {
    return this.bot.api.triggerTextChannelTyping(this.id);
  }
}
