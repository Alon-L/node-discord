import Channel from './Channel';
import TextChannel from './TextChannel';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import User from '../User';
import Bot from '../bot/Bot';

class DMChannel extends Channel implements TextChannel {
  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  public lastMessageId?: Snowflake | null;

  /**
   * The recipients of the DM
   */
  public recipients: Cluster<Snowflake, User>;

  constructor(bot: Bot, dmChannel: GatewayStruct) {
    super(bot, dmChannel);

    this.recipients = new Cluster<Snowflake, User>();

    this.lastMessageId = dmChannel.last_message_id;
    this.recipients.merge(
      dmChannel.recipients.map((user: GatewayStruct) => [user.id, new User(this.bot, user)]),
    );
  }
}

export default DMChannel;
