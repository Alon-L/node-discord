import Bot from './Bot';
import BotDispatchHandlers from '../../socket/BotDispatchHandlers';
import BotSocket from '../../socket/BotSocket';
import { GatewayCloseCodes } from '../../socket/constants';

/**
 * Responsible for the creation and closure of the WebSocket connection to the Discord API gateway
 * @class
 */
class BotConnection {
  /**
   * The bot behind the connection
   */
  private readonly bot: Bot;

  /**
   * Bot socket connection (may split into shards)
   */
  private readonly socket: BotSocket;

  /**
   * Handles every dispatch requests received from the Discord gateway
   */
  private readonly dispatchHandlers: BotDispatchHandlers;

  constructor(bot: Bot, token: string) {
    this.bot = bot;

    this.socket = new BotSocket(bot, token);

    this.dispatchHandlers = new BotDispatchHandlers();
  }

  /**
   * Creates a new bot connection
   * @returns {Promise<void>}
   */
  public async connect(): Promise<void> {
    await this.dispatchHandlers.registerEvents();
    await this.socket.startShards();
  }

  /**
   * Closes the currently running connection
   * @param {GatewayCloseCodes} code WebSocket close code
   */
  public disconnect(code = GatewayCloseCodes.ManualClosure): void {
    this.dispatchHandlers.clearEvents();
    this.socket.stopShards(code);
  }
}

export default BotConnection;