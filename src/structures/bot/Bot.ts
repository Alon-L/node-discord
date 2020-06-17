import { Serializable } from 'child_process';
import BotCommunication from './BotCommunication';
import BotConnection from './BotConnection';
import BotCommandsHandler from './handlers/BotCommandsHandler';
import { BotEventsHandler } from './handlers/events/BotEventsHandler';
import Cluster from '../../Cluster';
import { BotEvents } from '../../socket/constants';
import { botOptions, CacheOptions, WebsocketOptions } from '../../socket/properties';
import { ShardId, Snowflake } from '../../types/types';
import BotAPI from '../BotAPI';
import Emoji from '../Emoji';
import User from '../User';
import DMChannel from '../channels/DMChannel';
import GuildChannel from '../channels/GuildChannel';
import Guild from '../guild/Guild';
import GuildUnavailable from '../guild/GuildUnavailable';

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

// TODO: BotFetch
/**
 * The bot is the main operator of the API.
 * It handles the events, and properties for all structures.
 */
class Bot {
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
  public commands: BotCommandsHandler;

  /**
   * Responsible for handling all of the Bot's events
   */
  public events: BotEventsHandler;

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
   * {@link Cluster} of all {@link Guild}s after fetching their unavailable version
   */
  public guilds: Cluster<Snowflake, Guild>;

  /**
   * {@link Cluster} of all {@link GuildUnavailable}s associated to the Bot
   */
  public unavailableGuilds: Cluster<Snowflake, GuildUnavailable>;

  /**
   * {@link Cluster} of all {@link GuildChannel} the Bot caches
   */
  public channels: Cluster<Snowflake, GuildChannel>;

  /**
   * {@link Cluster} of all {@link DMChannel}s the Bot is part of
   */
  public dms: Cluster<Snowflake, DMChannel>;

  /**
   * {@link Cluster} of all {@link User}s found in all guilds the Bot is part of
   */
  public users: Cluster<Snowflake, User>;

  /**
   * {@link Cluster} of all {@link Emoji}s found in all guilds the Bot is part of
   */
  public emojis: Cluster<Snowflake, Emoji>;

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

    this.commands = new BotCommandsHandler();
    this.events = new BotEventsHandler();

    this.connection = new BotConnection(this, token);

    this.communication = new BotCommunication(this);

    this.guilds = new Cluster<Snowflake, Guild>();

    this.unavailableGuilds = new Cluster<Snowflake, GuildUnavailable>();

    this.channels = new Cluster<Snowflake, GuildChannel>();

    this.dms = new Cluster<Snowflake, DMChannel>();

    this.users = new Cluster<Snowflake, User>();

    this.emojis = new Cluster<Snowflake, Emoji>();
  }

  /**
   * Sends debug messages to the {@link BotEvents.Debug} event
   * @example ```typescript
   * bot.on(BotEvents.Debug, console.log);
   *
   * bot.debug('Hello World!'); // 'Hello World'
   * ```
   * @param {...unknown[]} messages The debug messages
   */
  public debug(...messages: unknown[]): void {
    this.events.emit(BotEvents.Debug, ...messages);
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

export default Bot;
