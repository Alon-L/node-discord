import { Serializable } from 'child_process';
import { BotShard, BotShardState } from './BotShard';
import { GatewayCloseCode, recommendedShardTimeout } from './constants';
import Collection from '../Collection';
import { Events } from '../structures/bot/events/events';
import { ShardId } from '../types';
import { Args } from '../types/EventEmitter';

/**
 * Creates and manages all bot shards
 */
export class BotShardManager {
  private readonly token: string;
  private readonly shards: Collection<ShardId, BotShard>;
  public readonly file: string;
  public readonly shardsAmount: number;

  constructor(file: string, token: string, shardsAmount: number) {
    this.file = file;
    this.token = token;
    this.shardsAmount = shardsAmount;

    this.shards = new Collection<ShardId, BotShard>();
  }

  /**
   * Starts the shards and stores them inside a {@link Collection}
   * @param {number} [timeout=5500] Time in milliseconds to wait for after creating each shard
   * @returns {Promise<void>}
   */
  public async start(timeout = recommendedShardTimeout): Promise<void> {
    for (let i = 0; i < this.shardsAmount; i++) {
      const shard = new BotShard(this, i);
      this.shards.set(shard.id, shard);
    }

    for (const [, shard] of this.shards) {
      shard.spawn();

      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }

  /**
   * Emits an event on all shards initiated with this manager
   * @param {string} event The event to be emitted
   * @returns {Promise<Serializable[]>}
   */
  public broadcast(event: string): Promise<Serializable[]> {
    const results: Promise<Serializable>[] = [];

    for (const [, shard] of this.shards) {
      results.push(shard.communicate(event));
    }

    return Promise.all(results);
  }

  /**
   * Emits a given event on all shards under this manager
   * @param {E} event The event to emit
   * @param {Args<Events, E>} args The arguments of the event
   */
  public emitEvent<E extends keyof Events>(event: E, args: Args<Events, E>): void {
    for (const [, shard] of this.shards) {
      shard.emitEvent(event, args);
    }
  }

  /**
   * Emits an event on a specific shard.
   * Returns undefined if no shard matching the given ID was found
   * @param {string} event The event to be emitted
   * @param {ShardId} shardId The ID of the shard where this event should be emitted
   * @returns {Promise<Serializable> | null}
   */
  public send(event: string, shardId: ShardId): Promise<Serializable> | undefined {
    const shard = this.shards.get(shardId);

    if (!shard) return undefined;

    return shard.communicate(event);
  }

  /**
   * Checks if all shards under this manager match the given state
   * @param {BotShardState} state The state to check if all shards match
   * @returns {boolean} Whether all shards match that state
   */
  public checkShardsState(state: BotShardState): boolean {
    return this.shards.toArray.every(value => value.state === state);
  }

  /**
   * Disconnects all active shards under this manager
   * @param {GatewayCloseCode} code The shards' close code
   */
  public disconnectAll(code = GatewayCloseCode.ManualClosure): void {
    for (const [, shard] of this.shards) {
      shard.disconnect(code);
    }
  }
}
