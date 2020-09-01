import { Message } from './Message';
import Collection from '../../Collection';
import { ReactionUsersController } from '../../controllers/reaction';
import { Snowflake } from '../../types';
import { Emoji } from '../Emoji';
import { BaseStruct, GatewayStruct } from '../base';
import { Member } from '../member/Member';
/**
 * Holds all users that reacted to a {@link Message} with a specific {@link Emoji}
 */
export declare class MessageReaction extends BaseStruct {
    /**
     * The message this reaction is attached to
     */
    message: Message;
    /**
     * The times this emoji has been used to react
     */
    count: number;
    /**
     * Whether the bot reacted using this emoji
     */
    botReacted: boolean | undefined;
    /**
     * The reaction's users controller
     */
    users: ReactionUsersController;
    /**
     * The members that added this reaction
     */
    members: Collection<Snowflake, Member>;
    /**
     * The emoji this reaction used. This emoji is partial
     */
    emoji: Emoji;
    constructor(message: Message, reaction: GatewayStruct);
    /**
     * @ignore
     * @param {GatewayStruct} reaction The reaction data
     * @returns {this}
     */
    init(reaction: GatewayStruct): this;
    /**
     * Deletes all reactions for this emoji.
     * Requires the {@link Permission.ManageMessages} permission
     * @returns {Promise<void>}
     */
    delete(): Promise<void>;
    /**
     * The ID of the emoji this reaction stores
     * Serves as an identifier for this reaction
     * @type {string}
     */
    get id(): string;
}
