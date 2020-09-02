import { UserAvatarFormat } from './Avatar';
import { BaseStruct, GatewayStruct } from './base';
import { DMChannel, TextChannel } from './channels';
import { UserFlags } from './flags';
import { Bot } from '../bot';
import { Snowflake } from '../types';
/**
 * User nitro types
 */
export declare enum NitroType {
    None = 0,
    NitroClassic = 1,
    Nitro = 2
}
/**
 * Represents a user in the Discord platform
 * @extends BaseStruct
 */
export declare class User extends BaseStruct {
    /**
     * The user's ID
     */
    id: Snowflake;
    /**
     * User's username, not unique across the platform
     */
    username: string;
    /**
     * User's 4-digit discord-tag
     */
    hashtag: string;
    /**
     * User's avatar image. Possibly null if user does not have an avatar image
     */
    avatarHash: string | null;
    /**
     * Whether the user is a bot
     */
    isBot: boolean | undefined;
    /**
     * Whether the user is an Official Discord System user (part of urgent message system)
     */
    system: boolean | undefined;
    /**
     * Whether the user has two factor enabled on their account
     */
    mfaEnabled: boolean | undefined;
    /**
     * The user's chosen language option
     */
    locale: string;
    /**
     * Whether the email on this user has been verified
     */
    verified: boolean | undefined;
    /**
     * The user's email
     */
    email: string | null | undefined;
    /**
     * {@link NitroType} object containing the type of nitro subscription on a user's account
     */
    nitroType: NitroType | undefined;
    /**
     * The flags on a user's account
     */
    flags: UserFlags | undefined;
    /**
     * The public flags on a user's account
     */
    publicFlags: UserFlags | undefined;
    /**
     * This user's DM channel with the bot, if cached
     */
    dm: DMChannel | undefined;
    constructor(bot: Bot, user: GatewayStruct);
    /**
     * @ignore
     * @param {GatewayStruct} user The user data
     * @returns {this}
     */
    init(user: GatewayStruct): this;
    /**
     * Returns a user's avatar URL. Returns the default user avatar if the user does not have an avatar.
     * *Note: the default user avatar only supports type {@link UserAvatarFormat.PNG}*
     * @param {UserAvatarFormat} format The avatar image format
     * @param {number} size The avatar image size
     * @returns {string}
     */
    avatarURL(format?: UserAvatarFormat, size?: number): string;
    /**
     * Creates a new DM channel between this user and the bot user
     * @returns {Promise<DMChannel>}
     */
    createDM(): Promise<DMChannel>;
    /**
     * Sends a DM message to the user from the bot user
     * @param {any} args Identical to the arguments of {@link TextChannel.sendMessage}
     * @returns {any} Identical to the return type of {@link TextChannel.sendMessage}
     */
    sendMessage(...args: Parameters<TextChannel['sendMessage']>): ReturnType<TextChannel['sendMessage']>;
    /**
     * Combines a user's username and hashtag and generates a full name
     * @type {string}
     * @example Day#0001
     */
    get fullName(): string;
    /**
     * @ignore
     * @returns {string}
     */
    toString(): string;
}
