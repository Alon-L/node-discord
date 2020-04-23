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

  public start(): void {
    this.interval.executor = setInterval(this.sendHeartbeat.bind(this), this.interval.timeout);
  }

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

  public stopHeartbeat(): void {
    this.interval.timeout = -1;
    clearInterval(this.interval.executor);
  }

  private ackFailed(): void {
    this.botSocket.close();
    this.botSocket.connect(true);
  }

  private get heartbeatData(): HeartbeatData {
    return { op: OPCodes.Heartbeat, d: this.sequence };
  }

  public receivedAck(): void {
    this.acked = true;
  }
}

export default BotHeartbeats;
