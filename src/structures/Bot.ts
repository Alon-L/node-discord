import Guild from './Guild';
import Cluster from '../Cluster';
import BotDispatchHandlers from '../socket/BotDispatchHandlers';
import BotSocket from '../socket/BotSocket';
import { ShardId, Snowflake } from '../types';

interface ShardOptions {
  id?: ShardId;
  amount?: number;
}

class Bot {
  private readonly token: string;
  private readonly socket: BotSocket;
  private readonly dispatchHandlers: BotDispatchHandlers;
  public readonly shardOptions: ShardOptions;

  public guilds: Cluster<Snowflake, Guild>;

  constructor(token: string) {
    this.token = token;

    this.shardOptions = {
      id: Number(process.env.SHARD_ID),
      amount: Number(process.env.SHARDS_AMOUNT),
    };

    this.socket = new BotSocket(this, token);

    this.dispatchHandlers = new BotDispatchHandlers();

    this.guilds = new Cluster<Snowflake, Guild>();
  }

  public async connect(): Promise<void> {
    await this.dispatchHandlers.registerEvents();
    await this.socket.connect();
  }
}

export default Bot;
