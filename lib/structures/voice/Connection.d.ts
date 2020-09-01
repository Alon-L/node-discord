import { GuildVoice } from './GuildVoice';
import { UDPSocket } from './UDPSocket';
import { VoiceWebSocket } from './VoiceWebSocket';
export declare class Connection {
    sockets: {
        ws: VoiceWebSocket;
        udp: UDPSocket;
    };
    token: string;
    active: boolean;
    private _endpoint;
    /**
     * The endpoint voice websocket is going to connect
     * @type {string}
     */
    set endpoint(val: string);
    get endpoint(): string;
    voice: GuildVoice;
    constructor(voice: GuildVoice);
}
