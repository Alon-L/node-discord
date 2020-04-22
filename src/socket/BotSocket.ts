import fetch from 'node-fetch';
import WebSocket from 'ws';
import Heartbeats from './Heartbeats';
import properties, { version, identify } from './properties';

export enum OPCodes {
  Dispatch,
  Heartbeat,
  Identify,
  PresenceUpdate,
  VoiceStateUpdate,
  Resume = 6,
  Reconnect,
  RequestGuildMembers,
  InvalidSession,
  Hello,
  HeartbeatACK,
}

export interface Payload {
  op: OPCodes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  d: any;
  s: number;
  t: string;
}

class BotSocket {
  private readonly token: string;
  // TODO: Set sessionId on READY event
  private sessionId: string;
  private heartbeats: Heartbeats;
  public ws: WebSocket;
  public sequence: number;

  constructor(token: string) {
    this.token = token;

    this.sequence = null;
  }

  public async connect(): Promise<void> {
    const url = await this.socketURL();

    this.ws = new WebSocket(url);
    this.ws.on('message', this.message.bind(this));

    this.heartbeats = new Heartbeats(this);
  }

  private async message(data: string): Promise<void> {
    const payload = BotSocket.parse(data);

    const { op, d, s } = payload;

    switch (op) {
      case OPCodes.Dispatch:
        this.sequence = s;
        this.handleDispatch(payload);
        break;
      case OPCodes.Hello:
        this.heartbeats.interval = d.heartbeat_interval;
        this.heartbeats.start();

        this.ws.send(
          BotSocket.pack({
            op: OPCodes.Identify,
            d: {
              ...identify,
              token: this.token,
            },
          }),
        );
        break;
      case OPCodes.HeartbeatACK:
        // TODO: Heartbeat ACK
        break;
    }
  }

  private handleDispatch(payload: Payload): void {
    console.log(payload.t);
  }

  private static parse(data: string): Payload {
    return JSON.parse(data);
  }

  public static pack(data: any): ReturnType<typeof JSON.stringify> {
    return JSON.stringify(data);
  }

  private async socketURL(): Promise<string> {
    return `${await this.url}/?v=${version}&encoding=json`;
  }

  private get url(): Promise<string> {
    return fetch(`${properties.baseURL}/gateway/bot`, {
      headers: { Authorization: `Bot ${this.token}` },
    })
      .then((res) => res.json())
      .then(({ url }) => url);
  }
}

export default BotSocket;
