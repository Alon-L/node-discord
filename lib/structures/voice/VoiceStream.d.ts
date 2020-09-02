/// <reference types="node" />
import { Readable } from 'stream';
import TypedEventEmitter from 'typed-emitter';
declare const VoiceStream_base: new () => TypedEventEmitter<VoiceStreamEvents> & Readable;
export declare class VoiceStream extends VoiceStream_base {
    private source;
    constructor();
    _read(size: number): Buffer;
    push(data: Buffer): boolean;
}
interface VoiceStreamEvents {
    data: [Buffer];
    readable: [];
    end: [];
    close: [];
    drain: [];
    resume: [];
    pause: [];
    error: [Error];
}
export {};
