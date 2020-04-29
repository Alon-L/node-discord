import fetch from 'node-fetch';
import { BotShardState } from './BotShard';
import BotSocketShard, { BotSocketShardState } from './BotSocketShard';
import { BotEvents, GatewayCloseCodes, recommendedShardTimeout } from './constants';
import properties from './properties';
import Cluster from '../Cluster';
import Bot from '../structures/bot/Bot';
import { ShardChangedState } from '../structures/bot/BotCommunication';
import { ShardId } from '../types';

export interface SessionStartLimit {
  total: number;
  remaining: number;
  reset_after: number;
}

interface GatewayBot {
  url: string;
  shards: number;
  session_start_limit: SessionStartLimit;
}

/**
 * Creates and manages socket shards
 * @class
 */
class BotSocket {
  private readonly token: string;
  private readonly shards: Cluster<ShardId, BotSocketShard>;
  public readonly bot: Bot;
  public gatewayURL!: string;
  public sessionStartLimit!: SessionStartLimit;

  constructor(bot: Bot, token: string) {
    this.bot = bot;

    this.token = token;

    this.shards = new Cluster<ShardId, BotSocketShard>();
  }

  /**
   * Start and connect every bot shard
   * @param {number} [timeout=5500] Time in milliseconds to wait before establishing a new shard
   * @returns {Promise<void>}
   */
  public async startShards(timeout = recommendedShardTimeout): Promise<void> {
    const {
      url: gatewayURL,
      shards: suggestedShards,
      session_start_limit: sessionStartLimit,
    } = await this.gateway;

    this.gatewayURL = gatewayURL;
    this.sessionStartLimit = sessionStartLimit;

    const { id, amount = suggestedShards } = this.bot.shardOptions;

    const shards = id !== undefined ? [id] : Array.from({ length: amount }).map((_, i) => i);

    for (const shardId of shards) {
      const botShard = new BotSocketShard(this, this.token, {
        amount,
        id: shardId,
      });

      this.shards.set(shardId, botShard);

      botShard.connect();

      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }

  /**
   * Stops and disconnects all active shards started by this process
   * @param {GatewayCloseCodes} code Gateway closure code
   */
  public stopShards(code: GatewayCloseCodes): void {
    for (const [, shard] of this.shards) {
      shard.close(code);
    }
  }

  /**
   * Checks if all shards under this socket match a given state
   * @param {BotSocketShardState} state The state to be checked for
   * @returns {boolean}
   */
  public checkShardsState(state: BotSocketShardState): boolean {
    return this.shards.toArray.every(value => value.state === state);
  }

  /**
   * Called when a shard under this socket changed its state.
   * If all shards under this socket now have the same state, a message will be sent to the {@link BotShardManager}
   * telling it to emit an event for all shards
   * @param {BotSocketShardState} state The state to be checked for
   * @param {BotShardState} shardState The state {@link BotShard} should be at after sending the message
   * @param {BotEvents} botEvent The event that should be emitted to all shards
   * @example
   * this.botSocket.shardChangedState(
   *  BotSocketShardState.Ready,
   *  BotShardState.Ready,
   *  BotEvents.Ready,
   * );
   */
  public shardChangedState(
    state: BotSocketShardState,
    shardState: BotShardState,
    botEvent: BotEvents,
  ): void {
    if (!this.checkShardsState(state)) return;

    if (process.send) {
      const message: ShardChangedState = {
        action: 'shardChangedState',
        payload: {
          state: shardState,
          botEvent,
        },
      };

      process.send(message);
    } else {
      this.bot.events.emit(botEvent);
    }
  }

  /**
   * Sends a request to the gateway in order to receive the connection information
   * @returns {Promise<GatewayBot>}
   */
  private get gateway(): Promise<GatewayBot> {
    return fetch(`${properties.baseURL}/gateway/bot`, {
      headers: { Authorization: `Bot ${this.token}` },
    }).then(res => res.json());
  }
}

export default BotSocket;
