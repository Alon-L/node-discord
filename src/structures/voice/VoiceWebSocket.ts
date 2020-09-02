import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { Connection } from './Connection';
import { VoiceHeartbeats } from './VoiceHeartbeats';
import { PayloadData } from '../../socket';

export enum VOICE_OPCODES {
  IDENTIFY,
  SELECT_PROTOCOL,
  READY,
  HEARTBEAT,
  SESSION_DESCRIPTION,
  SPEAKING,
  HEARTBEAT_ACK,
  RESUME,
  HELLO,
  RESUMED,
  DISCONNECT = 13,
}

/**
 * A payload thats gonna be sent to the Discord Voice Server
 */
export interface VoiceCommand {
  op: VOICE_OPCODES;
  d: PayloadData;
}

/**
 * A payload received from the Discord Voice Server gateway
 */
export interface VoicePayload extends VoiceCommand {
  s: number;
}

export class VoiceWebSocket extends EventEmitter {
  public connection: Connection;

  private ws?: WebSocket;
  private hearbeat?: VoiceHeartbeats;

  public sequnce!: number;

  constructor(connection: Connection) {
    super();

    this.connection = connection;
  }

  public open(): void {
    if (!this.connection.endpoint)
      throw new Error(
        'A voice gateway connection was tried to be established before endpoint declaration.',
      );

    this.ws = new WebSocket(`wss://${this.connection.endpoint.split(':')[0]}/?v=4`);

    this.ws.on('message', this.onMessage.bind(this));

    this.hearbeat = new VoiceHeartbeats(this);
  }

  private async onMessage(data: string) {
    const message: VoicePayload = JSON.parse(data);

    this.sequnce = message.s;

    this.connection.voice.bot.debug(message.op, VOICE_OPCODES[message.op], 'op - t');

    switch (message.op) {
      case VOICE_OPCODES.HELLO: {
        this.hearbeat!.interval.timeout = message.d.heartbeat_interval;
        this.hearbeat!.start();
        this.send({
          op: VOICE_OPCODES.IDENTIFY,
          d: {
            server_id: this.connection.voice.guild.id,
            user_id: this.connection.voice.bot.user!.id,
            session_id: this.connection.voice.guild.voiceStates.get(
              this.connection.voice.bot.user!.id,
            )?.sessionId,
            token: this.connection.token,
          },
        });
        break;
      }

      case VOICE_OPCODES.READY: {
        const ip = await this.connection.sockets.udp.discoverIP({
          ip: message.d.ip,
          port: message.d.port,
          ssrc: message.d.ssrc,
        });

        this.send({
          op: VOICE_OPCODES.SELECT_PROTOCOL,
          d: {
            protocol: 'udp',
            data: {
              address: ip.ip,
              port: ip.port,
              mode: 'xsalsa20_poly1305',
            },
          },
        });
        break;
      }

      case VOICE_OPCODES.SESSION_DESCRIPTION: {
        this.connection.sockets.udp.secretKeys = Buffer.from(message.d.secret_key as number[]);
        this.connection.sockets.udp.start();
        break;
      }
    }
  }

  send(data: VoiceCommand): void {
    if (this.ws) this.ws.send(JSON.stringify(data));
  }

  close(): void {
    this.ws?.close();
    this.hearbeat?.stopHeartbeat();
  }
}
