import { GuildVoice } from './GuildVoice';
import { Readable } from './Readable';
import { UDPSocket } from './UDPSocket';
import { VoiceWebSocket } from './VoiceWebSocket';

export class Connection {
  public sockets: {
    ws: VoiceWebSocket;
    udp: UDPSocket;
  } = {} as {
    ws: VoiceWebSocket;
    udp: UDPSocket;
  };

  public token!: string;

  public active = false;

  private _endpoint = '';

  /**
   * The endpoint voice websocket is going to connect
   * @type {string}
   */

  public set endpoint(val: string) {
    if (this._endpoint === val) return;
    else {
      this._endpoint = val;

      if (this.sockets.ws) {
        this.sockets.ws.close();
        this.sockets.ws.removeAllListeners();
      }
      if (this.sockets.udp) {
        this.sockets.udp.close();
        this.sockets.udp.removeAllListeners();
      }

      this.active = true;

      this.sockets = {
        ws: new VoiceWebSocket(this),
        udp: new UDPSocket(this),
      };

      this.sockets.ws.open();
    }
  }

  public get endpoint(): string {
    return this._endpoint;
  }

  public get PCMOut(): Readable {
    return this.sockets.udp.PCMOut;
  }

  public get OpusOut(): Readable {
    return this.sockets.udp.OpusOut;
  }

  public voice: GuildVoice;

  constructor(voice: GuildVoice) {
    this.voice = voice;
  }
}
