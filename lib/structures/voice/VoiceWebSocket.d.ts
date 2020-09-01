/// <reference types="node" />
import { EventEmitter } from 'events';
import { Connection } from './Connection';
import { PayloadData } from '../../socket';
export declare enum VOICE_OPCODES {
    IDENTIFY = 0,
    SELECT_PROTOCOL = 1,
    READY = 2,
    HEARTBEAT = 3,
    SESSION_DESCRIPTION = 4,
    SPEAKING = 5,
    HEARTBEAT_ACK = 6,
    RESUME = 7,
    HELLO = 8,
    RESUMED = 9,
    DISCONNECT = 13
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
export declare class VoiceWebSocket extends EventEmitter {
    connection: Connection;
    private ws?;
    private hearbeat?;
    sequnce: number;
    constructor(connection: Connection);
    open(): void;
    private onMessage;
    send(data: VoiceCommand): void;
    close(): void;
}
