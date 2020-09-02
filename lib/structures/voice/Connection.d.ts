import { GuildVoice } from './GuildVoice';
import { Readable } from './Readable';
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
    get PCMOut(): Readable;
    get OpusOut(): Readable;
    voice: GuildVoice;
    constructor(voice: GuildVoice);
}
