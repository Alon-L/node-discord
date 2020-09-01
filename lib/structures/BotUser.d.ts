import { BotPresence } from './BotPresence';
import { ImageURI } from './ImageURI';
import { User } from './User';
import { GatewayStruct } from './base';
import { PermissionFlags } from './flags';
import { PresenceGame, PresenceStatus } from './member';
import Collection from '../Collection';
import { Bot } from '../bot';
import { Snowflake } from '../types';
/**
 * Options for when modifying the bot user
 */
export interface ModifyBotUserOptions {
    /**
     * The modified bot user's username. If changed may cause the user's discriminator to be randomized
     */
    username?: string;
    /**
     * If passed, modifies the user's avatar.
     * Path to the new user's avatar image
     */
    avatar?: ImageURI | null;
}
/**
 * Options for when fetching guilds using the bot's user
 */
export interface FetchGuildsOptions {
    /**
     * Fetch guilds before this guild ID
     */
    before?: Snowflake;
    /**
     * Fetch guilds after this guild ID
     */
    after?: Snowflake;
    /**
     * Max number of guilds to return (1-100)
     * @default 100
     */
    limit?: number;
}
/**
 * Partial guild object
 */
export interface PartialGuild {
    /**
     * The ID of the guild
     */
    id: Snowflake;
    /**
     * The name of the guild
     */
    name: string;
    /**
     * The icon hash of the guild
     */
    icon: string;
    /**
     * Whether the bot user is the owner of the guild
     */
    owner: boolean;
    /**
     * The permissions for the bot in this guild
     */
    permissions: PermissionFlags;
}
/**
 * Sent by the bot to indicate a presence or status update
 */
export interface UpdateStatus {
    /**
     * UNIX time (in milliseconds) of when the client went idle, or null if the client is not idle
     */
    since?: number;
    /**
     * Null, or the user's new activity
     */
    game?: Partial<PresenceGame>;
    /**
     * Whether or not the client is AFK
     */
    afk?: boolean;
    /**
     * The user's new status
     */
    status: PresenceStatus;
}
/**
 * Represents the bot's user account
 */
export declare class BotUser extends User {
    presence: BotPresence;
    constructor(bot: Bot, user: GatewayStruct);
    /**
     * Modifies this bot's user account settings
     * @param {ModifyBotUserOptions} options The options for the modified bot user
     * @returns {Promise<BotUser>}
     */
    modify(options: ModifyBotUserOptions): Promise<BotUser>;
    /**
     * Fetches the guilds the bot user is a member of
     * @param {FetchGuildsOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, PartialGuild>>}
     */
    fetchGuilds(options?: FetchGuildsOptions): Promise<Collection<Snowflake, PartialGuild>>;
    /**
     * Leaves a guild by its ID
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<void>}
     */
    leaveGuild(guildId: Snowflake): Promise<void>;
}
