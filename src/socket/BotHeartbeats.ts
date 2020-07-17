import WebSocket from 'ws';
import BotSocketShard from './BotSocketShard';
import { OPCode } from './constants';

interface HeartbeatData {
  op: OPCode.Heartbeat;
  d: number;
}

interface HeartbeatInterval {
  timeout: number;
  executor?: NodeJS.Timeout;
}

/**
 * Handles the sending and receiving of Discord heartbeats
 */
class BotHeartbeats {
  private botSocketShard: BotSocketShard;
  private readonly ws: WebSocket;
  private readonly sequence: number | null;
  private acked: boolean;
  public interval: HeartbeatInterval;

  constructor(botSocket: BotSocketShard) {
    this.botSocketShard = botSocket;
    this.ws = botSocket.ws;

    this.sequence = botSocket.sequence;

    this.acked = true;

    this.interval = {
      timeout: 0,
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
    this.ws.send(this.botSocketShard.pack(this.heartbeatData), err => {
      if (err) throw err;
    });
  }

  /**
   * Resets the interval timeout and stops the interval
   */
  public stopHeartbeat(): void {
    this.interval.timeout = -1;

    if (this.interval.executor) {
      clearInterval(this.interval.executor);
    }
  }

  /**
   * Called when acking failed. Closes the socket and tries to reconnect
   */
  private ackFailed(): void {
    this.botSocketShard.close();
  }

  /**
   * The data required for when sending a heartbeat
   * @type {HeartbeatData}
   */
  private get heartbeatData(): HeartbeatData {
    return { op: OPCode.Heartbeat, d: this.sequence || -1 };
  }

  /**
   * Called when a heartbeat is acked
   */
  public receivedAck(): void {
    this.acked = true;
  }
}

export default BotHeartbeats;
