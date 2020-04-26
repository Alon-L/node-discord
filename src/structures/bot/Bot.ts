import BotConnection from './BotConnection';
import Cluster from '../../Cluster';
import { ShardId, Snowflake } from '../../types';
import Guild from '../Guild';
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
   * {@link Cluster} of all {@link Guild}s associated to the Bot
   */
  public guilds: Cluster<Snowflake, Guild>;

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
  }
}

export default Bot;
