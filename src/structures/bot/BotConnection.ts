import Bot from './Bot';
import { ShardCommunicationAction, ShardDisconnectAllRequest } from './BotCommunication';
import BotSocket from '../../socket/BotSocket';
import { GatewayCloseCode } from '../../socket/constants';

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
   * @param {GatewayCloseCode} code WebSocket close code
   */
  public disconnect(code = GatewayCloseCode.ManualClosure): void {
    this.socket.stopShards(code);
  }

  /**
   * Closes all currently running connections for all shards
   * @param {GatewayCloseCode} code WebSocket close code
   */
  public disconnectAll(code = GatewayCloseCode.ManualClosure): void {
    if (process.send) {
      const request: ShardDisconnectAllRequest = {
        action: ShardCommunicationAction.DisconnectAll,
        payload: code,
        identifier: Date.now(),
      };

      process.send(request);
    }
  }
}

export default BotConnection;
