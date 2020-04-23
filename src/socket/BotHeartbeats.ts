import WebSocket from 'ws';
import BotSocket, { OPCodes } from './BotSocket';

class BotHeartbeats {
  private ws: WebSocket;
  private readonly sequence: number;
  public interval: number;

  constructor(botSocket: BotSocket) {
    this.ws = botSocket.ws;
    this.sequence = botSocket.sequence;

    this.interval = 0;
  }

  public start(): void {
    setInterval(() => {
      this.ws.send(BotSocket.pack({ op: OPCodes.Heartbeat, d: this.sequence }), (err) => {
        if (err) console.error(err);
      });
    }, this.interval);
  }
}

export default BotHeartbeats;
