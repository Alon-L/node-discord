import Guild from './Guild';
import BotCommands from './handlers/BotCommands';
import BotEvents from './handlers/BotEvents';
import Cluster from '../Cluster';
import BotDispatchHandlers from '../socket/BotDispatchHandlers';
import BotSocket from '../socket/BotSocket';
import { ShardId, Snowflake } from '../types';

export interface ShardOptions {
  id?: ShardId;
  amount?: number;
}

class Bot {
  private readonly token: string;
  private readonly socket: BotSocket;
  private readonly dispatchHandlers: BotDispatchHandlers;
  public readonly shardOptions: ShardOptions;

  public commands: BotCommands;
  public events: BotEvents;

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

  public async connect(): Promise<void> {
    await this.dispatchHandlers.registerEvents();
    await this.socket.startShards();
  }
}

export default Bot;
