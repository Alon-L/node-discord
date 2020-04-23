import Guild from './Guild';
import Cluster from '../Cluster';
import BotDispatchHandlers from '../socket/BotDispatchHandlers';
import BotSocket from '../socket/BotSocket';
import { Snowflake } from '../types';

class Bot {
  private readonly token: string;
  private readonly socket: BotSocket;
  private readonly dispatchHandlers: BotDispatchHandlers;

  public guilds: Cluster<Snowflake, Guild>;

  constructor(token: string) {
    this.token = token;

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
