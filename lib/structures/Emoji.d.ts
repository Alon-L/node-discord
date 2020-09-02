import { Role } from './Role';
import { User } from './User';
import { BaseStruct, GatewayStruct } from './base';
import { Guild } from './guild';
import Collection from '../Collection';
import { Bot } from '../bot';
import { Snowflake } from '../types';
/**
 * Any kind of emoji. Could be its unicode name, ID or {@link Emoji} object
 */
export declare type EmojiResolvable = string | Snowflake | Emoji;
export declare class Emoji extends BaseStruct {
    /**
     * The ID of the emoji. Possibly null if the emoji class was generated from a standard emoji
     */
    emojiId: Snowflake | null;
    /**
     * The guild this emoji was created. Possibly undefined if this is a standard emoji
     */
    guild: Guild | undefined;
    /**
     * The name of the emoji. Possibly null in reaction emoji objects
     */
    name: string | null;
    /**
     * {@link Collection} of {@link Role}s this emoji is whitelisted to
     */
    roles: Collection<Snowflake, Role> | undefined;
    /**
     * The user that created this emoji
     */
    user: User | undefined;
    /**
     * Whether this emoji must be wrapped in colons
     */
    requiresColons: boolean | undefined;
    /**
     * Whether this emoji is managed
     */
    managed: boolean | undefined;
    /**
     * Whether this emoji is animated
     */
    animated: boolean | undefined;
    /**
     * Whether this emoji can be used, may be false due to loss of Server Boosts
     */
    available: boolean | undefined;
    constructor(bot: Bot, emoji: GatewayStruct, guild?: Guild);
    /**
     * @ignore
     * @param {GatewayStruct} emoji The emoji data
     * @returns {this}
     */
    init(emoji: GatewayStruct): this;
    /**
     * Returns this emoji's identifier.
     * An emoji identifier could be its name for built-in emojis, or a combination of its name and ID if it's a guild emoji.
     * @returns {string}
     */
    get id(): string;
    /**
     * Finds the identifier of the given emoji.
     * The emoji can be a Guild emoji, meaning we would have to search for it in the Bot's cached emojis Collection
     * @param {Collection<Snowflake, Emoji>} emojis An emojis cache to search for the emoji in
     * @param {EmojiResolvable} emoji The emoji to resolve
     * @returns {string | null}
     */
    static resolve(emojis: Collection<Snowflake, Emoji>, emoji: EmojiResolvable): string | null;
}
