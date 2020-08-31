import GuildVoice from './GuildVoice';
import UDPSocket from './UDPSocket';
import VoiceWebSocket from './VoiceWebSocket';

export default class Connection {
  public sockets!: {
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
    }
  }

  public get endpoint(): string {
    return this._endpoint;
  }

  public voice: GuildVoice;

  constructor(voice: GuildVoice) {
    this.voice = voice;
  }
}
