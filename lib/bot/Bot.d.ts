/// <reference types="node" />
import { Serializable } from 'child_process';
import { BotConnection } from './BotConnection';
import { CommandsHandler } from './handlers/command';
import { EventsHandler } from './handlers/events';
import Collection from '../Collection';
import { BotAPI } from '../api';
import { BotChannelsController, BotGuildsController, BotUsersController } from '../controllers/bot';
import { BotCommunication } from '../sharding';
import { WebsocketOptions } from '../socket';
import { BotUser } from '../structures';
import { GuildEmoji, GuildUnavailable } from '../structures/guild';
import { ShardId, Snowflake } from '../types';
/**
 * The options given to every Bot shard
 */
export interface ShardOptions {
    /**
     * Shard ID
     */
    id: ShardId;
    /**
     * Number of shards this instance of the bot uses
     */
    amount?: number;
}
/**
 * Bot cache options
 */
export interface CacheOptions {
    /**
     * The limit of messages cached in every channel. Set to `0` for no limit
     */
    messagesLimit: number;
}
/**
 * The default options used to initialize a Bot instance
 * @type {BotOptions}
 */
export declare const botOptions: BotOptions;
/**
 * The options used to initialize the Bot
 */
export interface BotOptions {
    /**
     * Websocket connection options
     */
    websocket: Partial<WebsocketOptions>;
    /**
     * Bot cache options
     */
    cache: CacheOptions;
}
/**
 * The bot is the main operator of the API.
 * It handles the events, and properties for all structures.
 */
export declare class Bot {
    /**
     * Bot token
     */
    private readonly token;
    /**
     * Options used to determine how the Bot operates
     */
    readonly options: BotOptions;
    /**
     * {@link ShardOptions} object containing sharding information
     */
    readonly shardOptions: ShardOptions;
    /**
     * Creates all outgoing API requests
     */
    readonly api: BotAPI;
    /**
     * Responsible for handling all of the Bot's commands
     */
    commands: CommandsHandler;
    /**
     * Responsible for handling all of the Bot's events
     */
    events: EventsHandler;
    /**
     * Responsible for managing the bot connection to the Discord gateway
     */
    connection: BotConnection;
    /**
     * Responsible for the communication between shards created by {@link BotShardManager}
     */
    communication: BotCommunication;
    /**
     * This bot's Discord user
     * Initializes right before the Bot READY event
     */
    user: BotUser | undefined;
    /**
     * The bot's guilds controller
     */
    guilds: BotGuildsController;
    /**
     * {@link Collection} of all {@link GuildUnavailable}s associated to the Bot
     */
    unavailableGuilds: Collection<Snowflake, GuildUnavailable>;
    /**
     * The bot's channels controller
     */
    channels: BotChannelsController;
    /**
     * The bot's users controller
     */
    users: BotUsersController;
    /**
     * {@link Collection} of all {@link GuildEmoji}s found in all guilds the Bot is part of
     */
    emojis: Collection<Snowflake, GuildEmoji>;
    constructor(token: string, options?: Partial<BotOptions>);
    /**
     * Connects the bot to the Discord gateway
     * @returns {Promise<void>}
     */
    connect(): Promise<void>;
    /**
     * Sends debug messages to the {@link BotEvent.Debug} event
     * @example ```typescript
     * bot.on(BotEvents.Debug, console.log);
     *
     * bot.debug('Hello World!'); // 'Hello World'
     * ```
     * @param {...unknown[]} messages The debug messages
     */
    debug(...messages: unknown[]): void;
    /**
     * @ignore
     * @returns {Serializable}
     */
    toJSON(): Serializable;
}
