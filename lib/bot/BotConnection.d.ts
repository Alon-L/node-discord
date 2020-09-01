import { Bot } from './Bot';
import Collection from '../Collection';
import { BotSocketShard, GatewayCloseCode } from '../socket';
import { GatewayStruct } from '../structures';
import { ShardId } from '../types';
/**
 * Responsible for the creation and closure of the WebSocket connection to the Discord API gateway
 */
export declare class BotConnection {
    /**
     * Bot socket connection (may split into shards)
     */
    private readonly socket;
    constructor(bot: Bot, token: string);
    /**
     * Creates a new bot connection
     * @returns {Promise<void>}
     */
    connect(): Promise<void>;
    /**
     * Closes the currently running connection
     * @param {GatewayCloseCode} code WebSocket close code
     */
    disconnect(code?: GatewayCloseCode): void;
    /**
     * Closes all currently running connections for all shards
     * @param {GatewayCloseCode} code WebSocket close code
     */
    disconnectAll(code?: GatewayCloseCode): void;
    /**
     * Modifies the presence of the bot
     * @param {GatewayStruct} presence The new presence for the bot
     * @returns {void}
     */
    modifyPresence(presence: GatewayStruct): void;
    get shards(): Collection<ShardId, BotSocketShard>;
}
