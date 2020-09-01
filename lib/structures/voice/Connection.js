"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UDPSocket_1 = __importDefault(require("./UDPSocket"));
const VoiceWebSocket_1 = __importDefault(require("./VoiceWebSocket"));
class Connection {
    constructor(voice) {
        this.active = false;
        this._endpoint = '';
        this.voice = voice;
    }
    /**
     * The endpoint voice websocket is going to connect
     * @type {string}
     */
    set endpoint(val) {
        if (this._endpoint === val)
            return;
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
                ws: new VoiceWebSocket_1.default(this),
                udp: new UDPSocket_1.default(this),
            };
        }
    }
    get endpoint() {
        return this._endpoint;
    }
}
exports.default = Connection;
