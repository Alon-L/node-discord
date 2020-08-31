import VoiceWebSocket from './VoiceWebSocket';

interface HeartbeatData {
  op: 3;
  d: number;
}

interface HeartbeatInterval {
  timeout: number;
  executor?: NodeJS.Timeout;
}

/**
 * Handles the sending and receiving of Discord heartbeats
 */
export default class VoiceHeartbeats {
  private readonly ws: VoiceWebSocket;
  private readonly sequence: number | null;
  private acked: boolean;
  public interval: HeartbeatInterval;

  constructor(ws: VoiceWebSocket) {
    this.ws = ws;

    this.sequence = ws.sequnce;

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
    if (!this.acked) return; // Instead of reconnecting to the voice ws it just skips this heartbeat.

    this.acked = false;
    this.ws.send(this.heartbeatData);
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
   * The data required for when sending a heartbeat
   * @type {HeartbeatData}
   */
  private get heartbeatData(): HeartbeatData {
    return { op: 3, d: this.interval.timeout };
  }

  /**
   * Called when a heartbeat is acked
   */
  public receivedAck(): void {
    this.acked = true;
  }
}
