import { Serializable } from 'child_process';
import { BotCommunication } from './BotCommunication';
import { BotConnection } from './BotConnection';
import { CommandsHandler } from './handlers/command';
import { EventsHandler } from './handlers/events';
import Collection from '../../Collection';
import { BotEvent, botOptions, CacheOptions, WebsocketOptions } from '../../socket';
import { ShardId, Snowflake } from '../../types';
import { User } from '../User';
import { BotAPI } from '../api';
import { BotChannelsController, BotGuildsController } from '../controllers';
import { GuildEmoji, GuildUnavailable } from '../guild';

/**
 * The options given to every Bot shard
 */
export interface ShardOptions {
  /**
   * Shard ID
   */
  id?: ShardId;

  /**
   * Number of shards this instance of the bot uses
   */
  amount?: number;
}

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
export class Bot {
  /**
   * Bot token
   */
  private readonly token: string;

  /**
   * Options used to determine how the Bot operates
   */
  public readonly options: BotOptions;

  /**
   * {@link ShardOptions} object containing sharding information
   */
  public readonly shardOptions: ShardOptions;

  /**
   * Creates all outgoing API requests
   */
  public readonly api: BotAPI;

  /**
   * Responsible for handling all of the Bot's commands
   */
  public commands: CommandsHandler;

  /**
   * Responsible for handling all of the Bot's events
   */
  public events: EventsHandler;

  /**
   * Responsible for managing the bot connection to the Discord gateway
   */
  public connection: BotConnection;

  /**
   * Responsible for the communication between shards created by {@link BotShardManager}
   */
  public communication: BotCommunication;

  /**
   * This bot's Discord user
   * Initializes right before the Bot READY event
   */
  public user: User | undefined;

  /**
   * The bot's guilds controller
   */
  public guilds: BotGuildsController;

  /**
   * {@link Collection} of all {@link GuildUnavailable}s associated to the Bot
   */
  public unavailableGuilds: Collection<Snowflake, GuildUnavailable>;

  /**
   * The bot's channels controller
   */
  public channels: BotChannelsController;

  /**
   * {@link Collection} of all {@link User}s found in all guilds the Bot is part of
   */
  public users: Collection<Snowflake, User>;

  /**
   * {@link Collection} of all {@link GuildEmoji}s found in all guilds the Bot is part of
   */
  public emojis: Collection<Snowflake, GuildEmoji>;

  constructor(token: string, options?: Partial<BotOptions>) {
    this.token = token;

    this.options = {
      ...botOptions,
      ...options,
    };

    this.api = new BotAPI(this, this.token);

    // Sets bot sharding data
    const shardId = Number(process.env.SHARD_ID);
    const shardAmount = Number(process.env.SHARDS_AMOUNT);

    this.shardOptions = {
      id: Number.isNaN(shardId) ? undefined : shardId,
      amount: Number.isNaN(shardAmount) ? undefined : shardAmount,
    };

    this.commands = new CommandsHandler();
    this.events = new EventsHandler();

    this.connection = new BotConnection(this, token);

    this.communication = new BotCommunication(this);

    this.guilds = new BotGuildsController(this);

    this.unavailableGuilds = new Collection<Snowflake, GuildUnavailable>();

    this.channels = new BotChannelsController(this);

    this.users = new Collection<Snowflake, User>();

    this.emojis = new Collection<Snowflake, GuildEmoji>();
  }

  /**
   * Sends debug messages to the {@link BotEvent.Debug} event
   * @example ```typescript
   * bot.on(BotEvents.Debug, console.log);
   *
   * bot.debug('Hello World!'); // 'Hello World'
   * ```
   * @param {...unknown[]} messages The debug messages
   */
  public debug(...messages: unknown[]): void {
    this.events.emit(BotEvent.Debug, ...messages);
  }

  /**
   * @ignore
   * @returns {Serializable}
   */
  public toJSON(): Serializable {
    return {
      token: this.token,
      shardOptions: this.shardOptions,
      commands: this.commands,
      events: this.events,
    };
  }
}
