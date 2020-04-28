import Channel from './Channel';
import TextChannel from './TextChannel';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import Timestamp from '../Timestamp';
import User from '../User';
import Bot from '../bot/Bot';

/**
 * Represents a private channel between the Bot and a User
 * @class
 * @extends Channel
 * @implements {TextChannel}
 */
class DMChannel extends Channel implements TextChannel {
  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  public lastMessageId?: Snowflake | null;

  // TODO: Rename this to recipient because only one recipient is engaged in a DM
  /**
   * The recipients of the DM
   */
  public recipients: Cluster<Snowflake, User>;

  /**
   * Timestamp of when the last pinned message was pinned
   */
  public lastPinTimestamp?: Timestamp;

  constructor(bot: Bot, dmChannel: GatewayStruct) {
    super(bot, dmChannel);

    this.lastMessageId = dmChannel.last_message_id;

    this.recipients = new Cluster<Snowflake, User>(
      dmChannel.recipients.map((user: GatewayStruct) => [user.id, new User(this.bot, user)]),
    );

    this.lastPinTimestamp = new Timestamp(dmChannel.last_pin_timestamp);
  }
}

export default DMChannel;
