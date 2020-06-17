import Message from './Message';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import BaseStruct, { GatewayStruct } from '../BaseStruct';
import Emoji from '../Emoji';
import User from '../User';
import Member from '../member/Member';

class MessageReaction extends BaseStruct {
  /**
   * The message this reaction is attached to
   */
  public message: Message;

  /**
   * The times this emoji has been used to react
   */
  public count!: number;

  /**
   * Whether the bot reacted using this emoji
   */
  public botReacted: boolean | undefined;

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
    super(message.bot, reaction);

    this.message = message;

    this.users = new Cluster<Snowflake, User>();
    this.members = new Cluster<Snowflake, Member>();

    this.emoji = new Emoji(this.bot, reaction.emoji);

    this.init(reaction);
  }

  /**
   * @ignore
   * @param {GatewayStruct} reaction The reaction data
   * @returns {this}
   */
  public init(reaction: GatewayStruct): this {
    this.count = reaction.count || 0;
    this.botReacted = reaction.me;

    this.emoji = new Emoji(this.bot, reaction.emoji);

    return this;
  }

  /**
   * Deletes all reactions for this emoji. This method requires the {@link Permission.ManageMessages} permission ot be present on the Bot.
   * @returns {Promise<void>}
   */
  public remove(): Promise<void> {
    return this.bot.api.removeMessageReactionsEmoji(
      this.message.channel.id,
      this.message.id,
      this.emoji,
    );
  }
}

export default MessageReaction;
