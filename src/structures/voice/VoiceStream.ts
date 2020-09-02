import { Readable } from 'stream';
import TypedEventEmitter from 'typed-emitter';

export class VoiceStream extends (Readable as new () => TypedEventEmitter<VoiceStreamEvents> & Readable) { //eslint-disable-line prettier/prettier
  private source: Buffer;

  constructor() {
    super();

    this.source = Buffer.alloc(1, 0);
  }

  _read(size: number): Buffer {
    return Buffer.from(this.source.slice(this.source.length - size));
  }

  push(data: Buffer): boolean {
    const res = super.push(data);
    this.source = Buffer.concat([this.source, data]);
    return res;
  }
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
