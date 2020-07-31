import { Message } from './Message';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { BaseStruct, GatewayStruct } from '../BaseStruct';
import { Emoji } from '../Emoji';
import { ReactionUsersController } from '../controllers';
import { Member } from '../member';

/**
 * Holds all users that reacted to a {@link Message} with a specific {@link Emoji}
 */
export class MessageReaction extends BaseStruct {
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
   * The reaction's users controller
   */
  public users: ReactionUsersController;

  /**
   * The members that added this reaction
   */
  public members: Collection<Snowflake, Member>;

  /**
   * The emoji this reaction used. This emoji is partial
   */
  public emoji: Emoji;

  constructor(message: Message, reaction: GatewayStruct) {
    super(message.bot, reaction);

    this.message = message;

    this.users = new ReactionUsersController(this);
    this.members = new Collection<Snowflake, Member>();

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
   * Deletes all reactions for this emoji.
   * Requires the {@link Permission.ManageMessages} permission
   * @returns {Promise<void>}
   */
  public delete(): Promise<void> {
    return this.bot.api.removeMessageReactionsEmoji(
      this.message.channel.id,
      this.message.id,
      this.emoji,
    );
  }

  /**
   * The ID of the emoji this reaction stores
   * Serves as an identifier for this reaction
   * @type {string}
   */
  public get id(): string {
    return this.emoji.id;
  }
}
