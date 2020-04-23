import fetch from 'node-fetch';
import WebSocket from 'ws';
import BotDispatchHandlers from './BotDispatchHandlers';
import BotHeartbeats from './BotHeartbeats';
import { OPCodes, GatewayEvents, GatewayCloseCodes, SocketStatus } from './constants';
import properties, { version, identify } from './properties';
import Bot from '../structures/Bot';

import Dict = NodeJS.Dict;

export enum BotSocketStatus {
  Processing,
  Ready,
  Closed,
  Terminated,
}

interface SessionStartLimit {
  total: number;
  remaining: number;
  reset_after: number;
}

interface GatewayBot {
  url: string;
  shards: number;
  session_start_limit: SessionStartLimit;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PayloadData = any;

export interface Payload {
  op: OPCodes;
  d: PayloadData;
  s: number;
  t: GatewayEvents;
}

class BotSocket {
  private readonly bot: Bot;
  private readonly token: string;
  private heartbeats: BotHeartbeats;
  private status: BotSocketStatus;
  public ws: WebSocket;
  public sessionId: string;

  public sequence: number;
  private lastSequence: number;

  constructor(bot: Bot, token: string) {
    this.bot = bot;

    this.token = token;

    this.status = BotSocketStatus.Closed;

    this.sequence = null;
    this.lastSequence = null;
  }

  public async connect(resume = false): Promise<void> {
    const { url, session_start_limit: sessionLimit } = await this.gateway;
    const socketURL = BotSocket.socketURL(url);

    await this.handleSessionLimit(sessionLimit);

    this.ws = new WebSocket(socketURL);

    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);

    this.heartbeats = new BotHeartbeats(this);

    if (resume) {
      this.ws.onopen = this.resume.bind(this);
    }
  }

  private async onMessage({ data }): Promise<void> {
    const payload = BotSocket.parse(data);

    const { op, t, d, s } = payload;

    console.log(op, t);

    switch (op) {
      case OPCodes.Dispatch:
        this.sequence = s;
        this.handleDispatch(payload);
        break;
      case OPCodes.InvalidSession:
        // Wait 5 seconds and re-identify
        setTimeout(this.identify.bind(this), 5000);
        break;
      case OPCodes.Hello:
        this.heartbeats.interval.timeout = d.heartbeat_interval;
        this.heartbeats.start();

        this.identify();

        this.status = BotSocketStatus.Processing;
        break;
      case OPCodes.HeartbeatACK:
        this.heartbeats.receivedAck();
        break;
    }
  }

  private identify(): void {
    const { id, amount } = this.bot.shardOptions;

    const data: Dict<unknown> = {
      ...identify,
      token: this.token,
    };

    if (id !== undefined && amount !== undefined) {
      data.shard = [id, amount];
    }

    this.ws.send(
      BotSocket.pack({
        op: OPCodes.Identify,
        d: data,
      }),
    );
  }

  private handleDispatch(payload: Payload): void {
    const { t } = payload;

    // Set session ID in case of a Ready event
    if (t === GatewayEvents.Ready) {
      this.sessionId = payload.d.session_id;
    }

    // Find the matching event and run it
    if (BotDispatchHandlers.events.has(t)) {
      BotDispatchHandlers.events.get(t)(payload, this.bot, this);
    }
  }

  public close(code = GatewayCloseCodes.NormalClosure): void {
    console.log('Terminating connection!');

    // Stop sending heartbeats
    this.heartbeats.stopHeartbeat();

    if (this.ws) {
      if (this.ws.readyState !== SocketStatus.Open) {
        // Remove all socket listeners
        this.cleanSocket();
      }

      // Close socket
      this.ws.close(code);
    }

    this.ws = null;

    this.lastSequence = this.sequence;

    this.status = BotSocketStatus.Terminated;
  }

  public ready(): void {
    this.status = BotSocketStatus.Ready;
    // TODO: Call the client Ready event
  }

  private onClose(event: WebSocket.CloseEvent): void {
    console.error('Close', event.code, event.reason, event.wasClean);

    this.heartbeats.stopHeartbeat();

    if (this.ws) {
      this.cleanSocket();
    }

    this.status = BotSocketStatus.Closed;
  }

  private resume(): void {
    this.ws.send(
      BotSocket.pack({
        op: OPCodes.Resume,
        d: {
          token: this.token,
          session_id: this.sessionId,
          seq: this.lastSequence || this.sequence,
        },
      }),
    );
  }

  private async handleSessionLimit(sessionLimit: SessionStartLimit): Promise<void> {
    const { remaining, reset_after: resetAfter } = sessionLimit;
    if (remaining === 0) {
      console.error(
        `Maximum number of daily Discord API connections exceeded! You will have to wait ${resetAfter}ms before attempting a new connection`,
      );
      await new Promise((resolve) => setTimeout(resolve, resetAfter));
    }
  }

  private cleanSocket(): void {
    this.ws.onmessage = null;
  }

  private static parse(data: string): Payload {
    return JSON.parse(data);
  }

  public static pack(data: any): ReturnType<typeof JSON.stringify> {
    return JSON.stringify(data);
  }

  private static socketURL(url: string): string {
    return `${url}/?v=${version}&encoding=json`;
  }

  private get gateway(): Promise<GatewayBot> {
    return fetch(`${properties.baseURL}/gateway/bot`, {
      headers: { Authorization: `Bot ${this.token}` },
    }).then((res) => res.json());
  }
}

export default BotSocket;
