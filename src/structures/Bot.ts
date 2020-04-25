import Guild from './Guild';
import BotCommands from './handlers/BotCommands';
import BotEvents from './handlers/BotEvents';
import Cluster from '../Cluster';
import BotDispatchHandlers from '../socket/BotDispatchHandlers';
import BotSocket from '../socket/BotSocket';
import { ShardId, Snowflake } from '../types';

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
   * Bot socket connection (may split into shards)
   */
  private readonly socket: BotSocket;

  /**
   * Handles every dispatch requests received from the Discord gateway
   */
  private readonly dispatchHandlers: BotDispatchHandlers;

  /**
   * {@link ShardOptions} object containing sharding information
   */
  public readonly shardOptions: ShardOptions;

  // TODO: Document these fields
  public commands: BotCommands;
  public events: BotEvents;

  /**
   * {@link Cluster} of all {@link Guild}s associated to the Bot
   */
  public guilds: Cluster<Snowflake, Guild>;

  constructor(token: string) {
    this.token = token;

    const shardId = Number(process.env.SHARD_ID);
    const shardAmount = Number(process.env.SHARD_ID);

    this.shardOptions = {
      id: Number.isNaN(shardId) ? undefined : shardId,
      amount: Number.isNaN(shardAmount) ? undefined : shardAmount,
    };

    this.socket = new BotSocket(this, token);

    this.dispatchHandlers = new BotDispatchHandlers();

    this.commands = new BotCommands(this);
    this.events = new BotEvents(this);

    this.guilds = new Cluster<Snowflake, Guild>();
  }

  /**
   * Creates a new bot connection
   * @returns {Promise<void>}
   */
  public async connect(): Promise<void> {
    await this.dispatchHandlers.registerEvents();
    await this.socket.startShards();
  }
}

export default Bot;
