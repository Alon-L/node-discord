import { Guild } from './Guild';
import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { GuildEmojiFormat } from '../Avatar';
import { Emoji } from '../Emoji';
import { ImageURI } from '../ImageURI';
import { Role } from '../Role';
import { GatewayStruct } from '../base';
/**
 * Options for when creating new guild emojis
 */
export interface CreateEmojiOptions {
    /**
     * The name of the emoji
     */
    name: string;
    /**
     * The 128x128 emoji image
     */
    image: ImageURI;
    /**
     * Roles for which this emoji will be whitelisted
     */
    roles?: (Snowflake | Role)[];
}
/**
 * Options for when modifying guild emojis
 */
export interface ModifyEmojiOptions {
    /**
     * The name of the emoji
     */
    name?: string;
    /**
     * Roles for which this emoji will be whitelisted
     */
    roles?: (Snowflake | Role)[];
}
/**
 * Structure for Emojis that were created in a Guild
 */
export declare class GuildEmoji extends Emoji {
    /**
     * Every guild emoji is associated to a guild
     */
    guild: Guild;
    /**
     * Every guild emoji has a name
     */
    name: string;
    constructor(bot: Bot, emoji: GatewayStruct, guild: Guild);
    /**
     * Every guild emoji has an identifier
     */
    get id(): string;
    /**
     * Returns the guild emoji's URL
     * @param {GuildEmojiFormat} format The format of the returned emoji image
     * @param {number} size The size of the returned emoji image
     * @returns {string}
     */
    URL(format?: GuildEmojiFormat, size?: number): string;
    /**
     * Modifies this emoji.
     * Requires the {@link Permission.ManageEmojis} permission
     * @param {ModifyEmojiOptions} options The options for the updated emoji
     * @returns {Promise<GuildEmoji>}
     */
    modify(options: ModifyEmojiOptions): Promise<GuildEmoji>;
    /**
     * Deletes this emoji.
     * Requires the {@link Permission.ManageEmojis} permission
     * @returns {Promise<void>}
     */
    delete(): Promise<void>;
    /**
     * @ignore
     * @returns {string}
     */
    toString(): string;
}
