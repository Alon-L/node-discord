import { Serializable } from 'child_process';
import BotCommunication from './BotCommunication';
import BotConnection from './BotConnection';
import BotCommandsHandler from './handlers/BotCommandsHandler';
import BotEventsHandler from './handlers/events/BotEventsHandler';
import Cluster from '../../Cluster';
import { BotEvents } from '../../socket/constants';
import { ShardId, Snowflake } from '../../types';
import User from '../User';
import DMChannel from '../channels/DMChannel';
import Guild from '../guild/Guild';
import GuildUnavailable from '../guild/GuildUnavailable';

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
 * The bot is the main operator of the API.
 * It handles the events, and properties for all structures.
 * @class
 */
class Bot {
  /**
   * Bot token
   */
  private readonly token: string;

  /**
   * {@link ShardOptions} object containing sharding information
   */
  public readonly shardOptions: ShardOptions;

  // TODO: Document these fields
  public commands: BotCommandsHandler;
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
   * Bot Discord user
   * Initializes right before the Bot READY event
   */
  public user?: User;

  /**
   * {@link Cluster} of all {@link Guild}s after fetching their unavailable version
   */
  public guilds: Cluster<Snowflake, Guild>;

  /**
   * {@link Cluster} of all {@link GuildUnavailable}s associated to the Bot
   */
  public unavailableGuilds: Cluster<Snowflake, GuildUnavailable>;

  /**
   * {@link Cluster} of all {@link DMChannel}s the Bot is part of
   */
  public dms: Cluster<Snowflake, DMChannel>;

  /**
   * {@link Cluster} of all {@link User}s found in all guilds the Bot is part of
   */
  public users: Cluster<Snowflake, User>;

  constructor(token: string) {
    this.token = token;

    // Set bot sharding data
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

    this.dms = new Cluster<Snowflake, DMChannel>();

    this.users = new Cluster<Snowflake, User>();
  }

  public debug(...messages: unknown[]): void {
    this.events.emit(BotEvents.Debug, ...messages);
  }

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
