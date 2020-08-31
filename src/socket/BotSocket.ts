import fetch from 'node-fetch';
import { BotSocketShard, BotSocketShardState, Payload } from './BotSocketShard';
import { GatewayCloseCode, OPCode, recommendedShardTimeout } from './constants';
import Collection from '../Collection';
import { baseURL } from '../api';
import { Bot } from '../bot';
import { BotStateEvents } from '../bot/handlers/events/events';
import { ShardChangedStateRequest, ShardCommunicationAction, BotShardState } from '../sharding';
import { GatewayStruct } from '../structures';
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
 */
export class BotSocket {
  private readonly token: string;
  public readonly shards: Collection<ShardId, BotSocketShard>;
  public readonly bot: Bot;
  public gatewayURL!: string;
  public sessionStartLimit!: SessionStartLimit;

  constructor(bot: Bot, token: string) {
    this.bot = bot;

    this.token = token;

    this.shards = new Collection<ShardId, BotSocketShard>();
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

      botShard.configure();

      this.shards.set(shardId, botShard);

      botShard.connect();

      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }

  /**
   * Stops and disconnects all active shards started by this process
   * @param {GatewayCloseCode} code Gateway closure code
   */
  public stopShards(code: GatewayCloseCode): void {
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
   * Called when a shard under this socket changes its state.
   * If all shards under this socket now have the same state, a message will be sent to the {@link BotShardManager}
   * telling it to emit an event for all shards
   * @param {BotSocketShardState} state The state to be checked for
   * @param {BotShardState} shardState The state {@link BotShard} should be at after sending the message
   * @param {BotStateEvents} botEvent The event that should be emitted to all shards
   * @example ```typescript
   * this.botSocket.shardChangedState(
   *  BotSocketShardState.Ready,
   *  BotShardState.Ready,
   *  BotEvents.Ready,
   * );
   * ```
   */
  public shardChangedState(
    state: BotSocketShardState,
    shardState: BotShardState,
    botEvent: BotStateEvents,
  ): void {
    if (!this.checkShardsState(state)) return;

    if (process.send) {
      const request: ShardChangedStateRequest = {
        action: ShardCommunicationAction.ShardChangedState,
        payload: {
          state: shardState,
          botEvent,
        },
        identifier: Date.now(),
      };

      process.send(request);
    } else {
      this.bot.events.emit(botEvent);
    }
  }

  /**
   * Modifies the presence of the bot
   * @param {GatewayStruct} presence The new presence for the bot
   * @param {number} [shardId] The shard id thats gonna be affected
   * @returns {void}
   */
  public modifyPresence(presence: GatewayStruct, shardId?: number): void {
    if (shardId) {
      const shard = this.shards.get(shardId);

      if (!shard) return;

      shard.send({
        op: OPCode.PresenceUpdate,
        d: presence,
      } as Payload);
    } else {
      for (const [, shard] of this.shards) {
        shard.send({
          op: OPCode.PresenceUpdate,
          d: presence,
        } as Payload);
      }
    }
  }

  /**
   * Sends a request to the gateway in order to receive the connection information
   * @returns {Promise<GatewayBot>}
   */
  private get gateway(): Promise<GatewayBot> {
    return fetch(`${baseURL}/gateway/bot`, {
      headers: { Authorization: `Bot ${this.token}` },
    }).then(res => res.json());
  }
}
