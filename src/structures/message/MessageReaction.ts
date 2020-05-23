import Message from './Message';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import BaseStruct, { GatewayStruct } from '../BaseStruct';
import Emoji from '../Emoji';
import Member from '../Member';
import User from '../User';

class MessageReaction extends BaseStruct {
  /**
   * The message this reaction is attached to
   */
  public message: Message;

  /**
   * The times this emoji has been used to react
   */
  public count: number;

  /**
   * Whether the bot reacted using this emoji
   */
  public botReacted: boolean;

  /**
   * The users that added this reaction
   */
  public users: Cluster<Snowflake, User>;

  /**
   * The members that added this reaction
   */
  public members: Cluster<Snowflake, Member>;

  /**
   * The emoji this reaction used. This emoji is partial
   */
  public emoji: Emoji;

  constructor(message: Message, reaction: GatewayStruct) {
    super(message.bot);

    this.message = message;

    this.count = reaction.count || 0;
    this.botReacted = reaction.me || false;

    this.users = new Cluster<Snowflake, User>();
    this.members = new Cluster<Snowflake, Member>();

    this.emoji = new Emoji(this.bot, reaction.emoji);
  }
}

export default MessageReaction;
