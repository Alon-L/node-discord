import { createSocket, Socket } from 'dgram';
import { EventEmitter } from 'events';
import { Readable } from 'stream';
import Connection from './Connection';
import { BotEvent } from '../../socket';

let LibSodium: typeof import('sodium-native');
let Opusscript: typeof import('opusscript');

try {
  LibSodium = require("sodium-native") //eslint-disable-line
} catch (err) {} //eslint-disable-line

try {
  Opusscript = require("opusscript") //eslint-disable-line
} catch (err) {} //eslint-disable-line

export default class UDPSocket extends EventEmitter {
  public connection: Connection;

  public socket: Socket;

  private auth?: { ip: string; port: number; ssrc: number };

  private nonce = Buffer.alloc(24);

  public secretKeys!: Buffer;

  /**
   * PCM Raw
   */
  public PCMOut = new Readable();

  /**
   * Opus Encoded
   */
  public OpusOut = new Readable();

  private OpusEncoder = new Opusscript(
    Opusscript.VALID_SAMPLING_RATES[4],
    2,
    Opusscript.Application.AUDIO,
  );

  constructor(connection: Connection) {
    super();
    this.connection = connection;

    this.OpusEncoder.encoderCTL(4002, 64000);

    this.socket = createSocket('udp4');
  }

  // This method should be called before the udp connection started!
  async discoverIP(server: {
    ip: string;
    port: number;
    ssrc: number;
  }): Promise<{ ip: string; port: number }> {
    this.auth = server;

    return new Promise(resolve => {
      const message = Buffer.alloc(70);

      message.writeUIntBE(this.auth!.ssrc, 0, 4);

      this.socket.send(message, 0, message.length, this.auth!.port, this.auth!.ip);

      this.socket.once('message', message => {
        const local = { ip: '', port: 0 };

        for (let i = 4; i < message.indexOf(0, i); i++) {
          local.ip += String.fromCharCode(message[i]);
        }

        local.port = parseInt(message.readUIntBE(message.length - 2, 2).toString(10));

        resolve(local);
      });
    });
  }

  start(): void {
    this.socket.on('message', message => {
      const data = this.decryptPackage(message);

      if (data instanceof Error) return this.connection.voice.bot.events.emit(BotEvent.Debug, data);

      this.OpusOut.push(data);

      this.PCMOut.push(this.OpusEncoder.decode(data));
    });
  }

  stop(): void {
    this.socket.removeAllListeners();
  }

  decryptPackage(buffer: Buffer): Buffer | Error {
    buffer.copy(this.nonce, 0, 0, 12);

    const nonce = Buffer.alloc(24);
    buffer.copy(nonce, 0, 0, 12);
    let data;
    data = Buffer.allocUnsafe(buffer.length - 12 - LibSodium.crypto_secretbox_MACBYTES);

    try {
      LibSodium.crypto_secretbox_open_easy(
        data,
        buffer.slice(12),
        this.nonce,
        Buffer.from(this.secretKeys),
      );
    } catch (err) {
      return err;
    }

    if ((buffer[0] & 0b1111) > 0) {
      data = data.slice(buffer[0] & (0b1111 * 4));
    }

    if (buffer[0] & 0b10000) {
      const l = (data[2] << 8) | data[3];
      let index = 4 + l * 4;
      while (data[index] == 0) {
        ++index;
      }
      data = data.slice(index);
    }

    return data;
  }

  close(): void {
    this.socket.close();
  }
}
