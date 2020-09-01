"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = require("dgram");
const events_1 = require("events");
const stream_1 = require("stream");
const socket_1 = require("../../socket");
let LibSodium;
let OpusScript;
try {
    LibSodium = require("sodium-native"); //eslint-disable-line
}
catch (err) { } //eslint-disable-line
try {
    OpusScript = require("opusscript").OpusScript; //eslint-disable-line
}
catch (err) { } //eslint-disable-line
class UDPSocket extends events_1.EventEmitter {
    constructor(connection) {
        super();
        this.nonce = Buffer.alloc(24);
        /**
         * PCM Raw
         */
        this.PCMOut = new stream_1.Readable();
        /**
         * Opus Encoded
         */
        this.OpusOut = new stream_1.Readable();
        this.connection = connection;
        this.socket = dgram_1.createSocket('udp4');
    }
    // This method should be called before the udp connection started!
    discoverIP(server) {
        return __awaiter(this, void 0, void 0, function* () {
            this.auth = server;
            return new Promise(resolve => {
                const message = Buffer.alloc(70);
                message.writeUIntBE(this.auth.ssrc, 0, 4);
                this.socket.send(message, 0, message.length, this.auth.port, this.auth.ip);
                this.socket.once('message', message => {
                    const local = { ip: '', port: 0 };
                    for (let i = 4; i < message.indexOf(0, i); i++) {
                        local.ip += String.fromCharCode(message[i]);
                    }
                    local.port = parseInt(message.readUIntBE(message.length - 2, 2).toString(10));
                    resolve(local);
                });
            });
        });
    }
    start() {
        if (!OpusScript)
            throw new Error('OpusScript not found!');
        if (!LibSodium)
            throw new Error('LibSodium not found!');
        if (!this.OpusEncoder) {
            this.OpusEncoder = new OpusScript(OpusScript.VALID_SAMPLING_RATES[4], 2, OpusScript.Application.AUDIO);
            this.OpusEncoder.encoderCTL(4002, 64000);
        }
        this.socket.on('message', message => {
            const data = this.decryptPackage(message);
            if (data instanceof Error)
                return this.connection.voice.bot.events.emit(socket_1.BotEvent.Debug, data);
            this.OpusOut.push(data);
            this.PCMOut.push(this.OpusEncoder.decode(data));
        });
    }
    stop() {
        this.socket.removeAllListeners();
    }
    decryptPackage(buffer) {
        buffer.copy(this.nonce, 0, 0, 12);
        const nonce = Buffer.alloc(24);
        buffer.copy(nonce, 0, 0, 12);
        let data;
        data = Buffer.allocUnsafe(buffer.length - 12 - LibSodium.crypto_secretbox_MACBYTES);
        try {
            LibSodium.crypto_secretbox_open_easy(data, buffer.slice(12), this.nonce, Buffer.from(this.secretKeys));
        }
        catch (err) {
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
    close() {
        this.socket.close();
    }
}
exports.default = UDPSocket;
