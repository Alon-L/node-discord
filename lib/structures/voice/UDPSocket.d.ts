/// <reference types="node" />
import { Socket } from 'dgram';
import { EventEmitter } from 'events';
import { Connection } from './Connection';
import { Readable } from './Readable';
export declare class UDPSocket extends EventEmitter {
    connection: Connection;
    socket: Socket;
    private auth?;
    private nonce;
    secretKeys: Buffer;
    /**
     * PCM Raw
     */
    PCMOut: Readable;
    /**
     * Opus Encoded
     */
    OpusOut: Readable;
    private OpusEncoder;
    constructor(connection: Connection);
    discoverIP(server: {
        ip: string;
        port: number;
        ssrc: number;
    }): Promise<{
        ip: string;
        port: number;
    }>;
    start(): void;
    stop(): void;
    decryptPackage(buffer: Buffer): Buffer | Error;
    close(): void;
}
