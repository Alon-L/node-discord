import Channel from './Channel';
import TextChannel from './TextChannel';
import { Snowflake } from '../../types/types';
import { GatewayStruct } from '../BaseStruct';
import Timestamp from '../Timestamp';
import User from '../User';
import Bot from '../bot/Bot';
import ChannelMessagesController from '../controllers/ChannelMessagesController';
import Message, { MessageData, MessageOptions } from '../message/Message';
import MessageEmbed from '../message/MessageEmbed';

/**
 * Represents a private channel between the Bot and a User
 */
class DMChannel extends Channel implements TextChannel {
  /** @inheritDoc */
  public lastMessageId: Snowflake | null | undefined;

  /** @inheritDoc */
  public lastPinTimestamp: Timestamp | undefined;

  /** @inheritDoc */
  public messages: ChannelMessagesController;

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

    this.lastMessageId = dmChannel.last_message_id;

    this.recipient = new User(this.bot, dmChannel.recipients[0]);

    this.lastPinTimestamp = new Timestamp(dmChannel.last_pin_timestamp);

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

  /** @inheritDoc */
  public pinMessage(messageId: Snowflake): Promise<void> {
    return this.bot.api.pinMessage(this.id, messageId);
  }

  /** @inheritDoc */
  public unpinMessage(messageId: Snowflake): Promise<void> {
    return this.bot.api.unpinMessage(this.id, messageId);
  }
}

export default DMChannel;
