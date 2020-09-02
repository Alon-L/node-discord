"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceStream = void 0;
const stream_1 = require("stream");
class VoiceStream extends stream_1.Readable {
    constructor() {
        super();
        this.source = Buffer.alloc(1, 0);
    }
    _read(size) {
        return Buffer.from(this.source.slice(this.source.length - size));
    }
    push(data) {
        const res = super.push(data);
        this.source = Buffer.concat([this.source, data]);
        return res;
    }
}
exports.VoiceStream = VoiceStream;
