import Bot from './Bot';
import BotSocket from '../../socket/BotSocket';
import { GatewayCloseCodes } from '../../socket/constants';

/**
 * Responsible for the creation and closure of the WebSocket connection to the Discord API gateway

 */
class BotConnection {
  /**
   * Bot socket connection (may split into shards)
   */
  private readonly socket: BotSocket;

  constructor(bot: Bot, token: string) {
    this.socket = new BotSocket(bot, token);
  }

  /**
   * Creates a new bot connection
   * @returns {Promise<void>}
   */
  public async connect(): Promise<void> {
    await this.socket.startShards();
  }

  /**
   * Closes the currently running connection
   * @param {GatewayCloseCodes} code WebSocket close code
   */
  public disconnect(code = GatewayCloseCodes.ManualClosure): void {
    this.socket.stopShards(code);
  }
}

export default BotConnection;
