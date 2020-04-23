import WebSocket from 'ws';
import BotSocket from './BotSocket';
import { OPCodes } from './constants';

interface HeartbeatData {
  op: OPCodes.Heartbeat;
  d: number;
}

interface HeartbeatInterval {
  timeout: number;
  executor: NodeJS.Timeout;
}

/**
 * Handles the sending and receiving of Discord heartbeats
 * @class
 */
class BotHeartbeats {
  private botSocket: BotSocket;
  private readonly ws: WebSocket;
  private readonly sequence: number;
  private acked: boolean;
  public interval: HeartbeatInterval;

  constructor(botSocket: BotSocket) {
    this.botSocket = botSocket;
    this.ws = botSocket.ws;

    this.sequence = botSocket.sequence;

    this.acked = true;

    this.interval = {
      timeout: 0,
      executor: null,
    };
  }

  /**
   * Starts the heartbeat interval
   */
  public start(): void {
    this.interval.executor = setInterval(this.sendHeartbeat.bind(this), this.interval.timeout);
  }

  /**
   * Sends a heartbeat and checks if the last one acked
   */
  public sendHeartbeat(): void {
    if (!this.acked) {
      this.ackFailed();
      return;
    }

    this.acked = false;
    this.ws.send(BotSocket.pack(this.heartbeatData), (err) => {
      if (err) throw err;
    });
  }

  /**
   * Resets the interval timeout and stops the interval
   */
  public stopHeartbeat(): void {
    this.interval.timeout = -1;
    clearInterval(this.interval.executor);
  }

  /**
   * Called when acking failed. Close the socket and try to reconnect
   */
  private ackFailed(): void {
    this.botSocket.close();
    this.botSocket.connect(true);
  }

  /**
   * The data required for when sending a heartbeat
   * @type {HeartbeatData}
   */
  private get heartbeatData(): HeartbeatData {
    return { op: OPCodes.Heartbeat, d: this.sequence };
  }

  /**
   * Called when a heartbeat is acked
   */
  public receivedAck(): void {
    this.acked = true;
  }
}

export default BotHeartbeats;
