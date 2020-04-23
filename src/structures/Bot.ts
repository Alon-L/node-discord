import BotDispatchHandlers from '../socket/BotDispatchHandlers';
import BotSocket from '../socket/BotSocket';

class Bot {
  private readonly token: string;
  private readonly socket: BotSocket;
  private readonly dispatchHandlers: BotDispatchHandlers;

  constructor(token: string) {
    this.token = token;

    this.socket = new BotSocket(this, token);

    this.dispatchHandlers = new BotDispatchHandlers();
  }

  public async connect(): Promise<void> {
    await this.dispatchHandlers.registerEvents();
    await this.socket.connect();
  }
}

export default Bot;
