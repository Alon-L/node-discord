import BotConnection from './BotConnection';
import Cluster from '../../Cluster';
import { ShardId, Snowflake } from '../../types';
import User from '../User';
import DMChannel from '../channels/DMChannel';
import Guild from '../guild/Guild';
import GuildUnavailable from '../guild/GuildUnavailable';
import BotCommands from '../handlers/BotCommands';
import BotEvents from '../handlers/BotEvents';

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
  public commands: BotCommands;
  public events: BotEvents;

  /**
   * Responsible for managing the bot connection to the Discord gateway
   */
  public connection: BotConnection;

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

  constructor(token: string) {
    this.token = token;

    // Set bot sharding data
    const shardId = Number(process.env.SHARD_ID);
    const shardAmount = Number(process.env.SHARDS_AMOUNT);

    this.shardOptions = {
      id: Number.isNaN(shardId) ? undefined : shardId,
      amount: Number.isNaN(shardAmount) ? undefined : shardAmount,
    };

    this.commands = new BotCommands(this);
    this.events = new BotEvents(this);

    this.connection = new BotConnection(this, token);

    this.guilds = new Cluster<Snowflake, Guild>();

    this.unavailableGuilds = new Cluster<Snowflake, GuildUnavailable>();

    this.dms = new Cluster<Snowflake, DMChannel>();
  }

  public log(...messages: unknown[]): void {
    this.events.emit('LOG', ...messages);
  }
}

export default Bot;
