"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = exports.botOptions = void 0;
const BotConnection_1 = require("./BotConnection");
const command_1 = require("./handlers/command");
const events_1 = require("./handlers/events");
const Collection_1 = __importDefault(require("../Collection"));
const api_1 = require("../api");
const bot_1 = require("../controllers/bot");
const sharding_1 = require("../sharding");
const socket_1 = require("../socket");
/**
 * The default options used to initialize a Bot instance
 * @type {BotOptions}
 */
exports.botOptions = {
    cache: {
        messagesLimit: 100,
    },
    websocket: {
        v: api_1.version,
    },
    shards: {
        enabled: false,
        size: 'default',
    },
};
/**
 * The bot is the main operator of the API.
 * It handles the events, and properties for all structures.
 */
class Bot {
    constructor(token, options) {
        this.token = token;
        this.options = {
            ...exports.botOptions,
            ...options,
        };
        this.api = new api_1.BotAPI(this, this.token);
        // Sets bot sharding data
        const shardId = parseInt(process.env.SHARD_ID);
        const shardAmount = parseInt(process.env.SHARDS_AMOUNT);
        this.shardOptions = {
            id: shardId || 0,
            amount: shardAmount || 1,
        };
        this.commands = new command_1.CommandsHandler();
        this.events = new events_1.EventsHandler();
        this.connection = new BotConnection_1.BotConnection(this, token);
        this.communication = new sharding_1.BotCommunication(this);
        this.guilds = new bot_1.BotGuildsController(this);
        this.unavailableGuilds = new Collection_1.default();
        this.channels = new bot_1.BotChannelsController(this);
        this.users = new bot_1.BotUsersController(this);
        this.emojis = new Collection_1.default();
    }
    /**
     * Connects the bot to the Discord gateway
     * @returns {Promise<void>}
     */
    connect() {
        return this.connection.connect();
    }
    /**
     * Sends debug messages to the {@link BotEvent.Debug} event
     * @example ```typescript
     * bot.on(BotEvents.Debug, console.log);
     *
     * bot.debug('Hello World!'); // 'Hello World'
     * ```
     * @param {...unknown[]} messages The debug messages
     */
    debug(...messages) {
        this.events.emit(socket_1.BotEvent.Debug, ...messages);
    }
    /**
     * @ignore
     * @returns {Serializable}
     */
    toJSON() {
        return {
            token: this.token,
            shardOptions: this.shardOptions,
            commands: this.commands,
            events: this.events,
        };
    }
}
exports.Bot = Bot;
