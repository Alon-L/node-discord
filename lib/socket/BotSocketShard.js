"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotSocketShard = void 0;
const querystring_1 = __importDefault(require("querystring"));
const ws_1 = __importDefault(require("ws"));
const BotHeartbeats_1 = require("./BotHeartbeats");
const constants_1 = require("./constants");
const events = __importStar(require("./handlers"));
const properties_1 = require("./properties");
const api_1 = require("../api");
const sharding_1 = require("../sharding");
// Initializes variables for optional libraries
let erlpack;
let zlib;
/**
 * Connects every bot shard to a {@link WebSocket} with the Discord Gateway.
 * Handles gateway events and messages
 */
class BotSocketShard {
    constructor(botSocket, token, shard) {
        this.botSocket = botSocket;
        this.bot = botSocket.bot;
        this.token = token;
        this.shard = shard;
        this.retryTimeout = 0;
        this.pendingGuilds = new Set();
        this.state = 3 /* Closed */;
        this.sequence = null;
        this.lastSequence = null;
    }
    /**
     * Loads optional libraries and sets the options for the gateway websocket initialization
     * @returns {void}
     */
    configure() {
        try {
            erlpack = require('erlpack');
        }
        catch (err) {
            // Use json encoding
        }
        try {
            zlib = require('zlib-sync');
            // Create new Inflate context
            this.zlib = new zlib.Inflate({
                chunkSize: 128 * 1024,
                windowBits: 32,
            });
        }
        catch (err) {
            // Do not use data compressing
        }
        this.options = {
            v: api_1.version,
            encoding: erlpack ? 'etf' : 'json',
            compress: zlib && 'zlib-stream',
            ...this.bot.options.websocket,
        };
        this.bot.debug(this.options, 'options');
    }
    /**
     * Connects to the Discord Gateway and resumes a previous connection if needed
     * @param {boolean} resume Whether to resume a previous connection
     * @returns {Promise<void>}
     */
    async connect(resume = false) {
        this.bot.debug('Connecting...');
        if (this.state === 0 /* Connecting */)
            return;
        this.state = 0 /* Connecting */;
        const { gatewayURL, sessionStartLimit } = this.botSocket;
        const socketURL = this.socketURL(gatewayURL);
        await this.handleSessionLimit(sessionStartLimit);
        this.ws = new ws_1.default(socketURL);
        this.ws.on('message', this.onMessage.bind(this));
        this.ws.on('close', this.onClose.bind(this));
        this.heartbeats = new BotHeartbeats_1.BotHeartbeats(this);
        this.botSocket.sessionStartLimit.remaining--;
        if (resume && this.lastSequence) {
            this.ws.on('open', this.resume.bind(this));
        }
    }
    /**
     * Decompresses data from the WebSocket if the compress option is sent to the gateway
     * @param {Buffer} data The message received from the gateway
     * @returns {Buffer | undefined}
     */
    decompressData(data) {
        if (!this.zlib || !zlib)
            return;
        if (data.length < 4 || data.readUInt32BE(data.length - 4) !== 0xffff) {
            this.zlib.push(data, false);
            return;
        }
        this.zlib.push(data, zlib.Z_SYNC_FLUSH);
        if (this.zlib.err) {
            this.bot.debug(`Zlib error: ${this.zlib.err} - ${this.zlib.msg}`);
            return;
        }
        return Buffer.from(this.zlib.result);
    }
    /**
     * Uses the right decoding and decompression to retrieve the payload object from the gateway message
     * @param {WebSocket.Data} messageData The data of the message received from the gateway
     * @returns {Payload | undefined}
     */
    retrievePayload(messageData) {
        let data;
        if (messageData instanceof ArrayBuffer) {
            // eslint-disable-next-line no-param-reassign
            messageData = new Uint8Array(messageData);
        }
        if (messageData instanceof Buffer) {
            /*
            Payloads are served inside Buffer when:
            1. The ETF encoding is used
            2. Compression is used
      
            Decompress the message, and store it in the right format
             */
            const decompressed = this.options.compress === 'zlib-stream' ? this.decompressData(messageData) : messageData;
            if (!decompressed)
                return;
            data = this.options.encoding === 'etf' ? decompressed : decompressed.toString();
        }
        else if (typeof messageData === 'string') {
            // Payloads are served inside a string when the JSON encoding is used without compression
            data = messageData;
        }
        if (!data)
            return;
        return BotSocketShard.parse(data);
    }
    /**
     * Called when a new message is received from the gateway
     * @param {Data} message WebSocket message event
     * @returns {void}
     */
    onMessage(message) {
        const payload = this.retrievePayload(message);
        if (!payload)
            return;
        const { op, t, d, s } = payload;
        this.bot.debug(op, t, 'op - t');
        switch (op) {
            case 0 /* Dispatch */:
                this.sequence = s;
                this.handleDispatch(payload);
                break;
            case 7 /* Reconnect */:
                this.close(4000 /* UnknownError */);
                break;
            case 9 /* InvalidSession */:
                // Wait 5 seconds and re-identify
                setTimeout(this.identify.bind(this), 5000);
                break;
            case 10 /* Hello */:
                this.heartbeats.interval.timeout = d.heartbeat_interval;
                this.heartbeats.start();
                this.identify();
                this.state = 1 /* Processing */;
                break;
            case 11 /* HeartbeatACK */:
                this.heartbeats.receivedAck();
                break;
        }
    }
    /**
     * Sends a new identify request to the gateway.
     * Will use shards if needed
     */
    identify() {
        const { id, amount } = this.shard;
        this.send({
            op: 2 /* Identify */,
            d: {
                ...properties_1.identify,
                token: this.token,
                shard: [id, amount],
            },
        });
    }
    /**
     * Calls the matching dispatch event from {@link events}
     * @param {Payload} payload Dispatch payload
     */
    handleDispatch(payload) {
        const { t } = payload;
        // Set session ID in case of a Ready event
        if (t === "READY" /* Ready */) {
            this.sessionId = payload.d.session_id;
        }
        // Find the matching event and run it
        const event = events[t];
        if (event) {
            event(payload, this.bot, this);
        }
    }
    /**
     * Close the connection between the bot and the gateway
     * @param {GatewayCloseCode} code Socket close code https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes
     */
    close(code = 1000 /* NormalClosure */) {
        this.bot.debug('Closing connection!');
        this.state = 4 /* Terminated */;
        // Stop sending heartbeats
        this.heartbeats.stopHeartbeat();
        this.lastSequence = this.sequence;
        // Close socket
        this.ws.close(code);
    }
    /**
     * Called when the bot is fully ready to proceed, after collecting
     * all guilds from GUILD_CREATE events
     */
    ready() {
        this.state = 2 /* Ready */;
        this.retryTimeout = 0;
        this.bot.debug('Ready!', this.bot.guilds.cache.map(i => i.name));
        this.bot.events.emit(constants_1.BotEvent.ShardReady, this);
        this.botSocket.shardChangedState(2 /* Ready */, sharding_1.BotShardState.Ready, constants_1.BotEvent.Ready);
    }
    /**
     * Called when the close event from the {@link WebSocket} is emitted
     * @param {number} code WebSocket closure code
     * @param {string} reason The reason for the WebSocket closure
     */
    async onClose(code, reason) {
        this.bot.debug('Close', code, reason);
        this.state = 3 /* Closed */;
        // Emit the 'ShardClose' event to the Bot
        this.bot.events.emit(constants_1.BotEvent.ShardClose, this);
        // Tell the BotSocket that the shard has been closed
        this.botSocket.shardChangedState(3 /* Closed */, sharding_1.BotShardState.Closed, constants_1.BotEvent.Close);
        this.heartbeats.stopHeartbeat();
        if (!constants_1.UnreconnectableGatewayCloseCodes.includes(code)) {
            if (this.retryTimeout) {
                await new Promise(resolve => setTimeout(resolve, this.retryTimeout));
            }
            this.retryTimeout += 1000;
            await this.connect(!constants_1.UnresumeableGatewayCloseCodes.includes(code));
        }
    }
    /**
     * Sends a request to the gateway in order to resume from the last connection
     */
    resume() {
        this.send({
            op: 6 /* Resume */,
            d: {
                token: this.token,
                session_id: this.sessionId,
                seq: this.lastSequence || this.sequence,
            },
        });
    }
    /**
     * Waits if no further connections can be made at the time
     * @param {SessionStartLimit} sessionLimit Session start limit object received
     * from connecting to the gateway
     * @returns {Promise<void>}
     */
    async handleSessionLimit(sessionLimit) {
        const { remaining, reset_after: resetAfter } = sessionLimit;
        this.bot.debug(remaining, resetAfter, 'Handle session limit');
        if (remaining === 0) {
            console.error(`Maximum number of daily Discord API connections exceeded! You will have to wait ${resetAfter}ms before attempting a new connection`);
            await new Promise(resolve => setTimeout(resolve, resetAfter));
        }
    }
    /**
     * Packs and sends the data to the WebSocket
     * @param {unknown} data The data
     * @returns {void}
     */
    send(data) {
        return this.ws.send(this.pack(data));
    }
    /**
     * Transfers the received data from the gateway into a {@link Payload} object
     * @param {string} data Data received from the gateway
     * @returns {Payload}
     */
    static parse(data) {
        if (data instanceof Buffer) {
            if (!erlpack)
                return;
            return erlpack.unpack(data);
        }
        else {
            return JSON.parse(data);
        }
    }
    /**
     * Transfers the data into format which can be sent across the gateway
     * @param {any} data Data to be transferred and sent to the gateway
     * @returns {string}
     */
    pack(data) {
        return this.options.encoding === 'etf' ? erlpack === null || erlpack === void 0 ? void 0 : erlpack.pack(data) : JSON.stringify(data);
    }
    /**
     * Get the fully modified Socket URL to use when connecting to the gateway
     * @param {string} url Socket URL
     * @returns {string}
     */
    socketURL(url) {
        return `${url}/?${querystring_1.default.stringify(this.options)}`;
    }
}
exports.BotSocketShard = BotSocketShard;
