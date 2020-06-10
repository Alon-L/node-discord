import { ChildProcess, fork, Serializable } from 'child_process';
import path from 'path';
import BotShardManager from './BotShardManager';
import {
  ShardCommunicationActions,
  ShardCommunicationResults,
  ShardCommunicationSendPayload,
  ShardDispatchEvent,
  ShardEmitEvent,
  ShardMessage,
  ShardResponse,
  ShardChangedState,
  ShardCommunicationEvents,
} from '../structures/bot/BotCommunication';
import { Events } from '../structures/bot/handlers/events/events';
import { Args } from '../types/EventEmitter';
import { ShardId } from '../types/types';

/**
 * The shard state
 */
export enum BotShardState {
  Ready,
  Closed,
}

/**
 * Creates and handles the communication of a shard

 */
class BotShard {
  private readonly manager: BotShardManager;
  private process!: ChildProcess;
  public readonly id: ShardId;
  public state: BotShardState;

  constructor(manager: BotShardManager, id: ShardId) {
    this.manager = manager;

    this.id = id;

    this.state = BotShardState.Closed;
  }

  /**
   * Spawns a new child according to the given file path.
   * Sets the environmental variables for the process with the sharding information
   */
  public spawn(): void {
    this.process = fork(path.resolve(this.manager.file), [], {
      env: {
        SHARD_ID: this.id.toString(),
        SHARDS_AMOUNT: this.manager.shardsAmount.toString(),
      },
    });

    this.process.on('message', this.onMessage.bind(this));
  }

  /**
   * Listener for child process messages
   * @param {ShardMessage} message The message received from the child process
   * @returns {Promise<void>}
   */
  public async onMessage(message: ShardMessage | ShardChangedState): Promise<void> {
    switch (message.action) {
      // Broadcast requested by the shard
      case ShardCommunicationActions.Broadcast: {
        if (typeof message.payload !== 'string')
          throw new TypeError('Invalid type of payload when calling the sharding broadcast action');

        const results = await this.manager.broadcast(message.payload);
        const reply: ShardDispatchEvent = {
          action: ShardCommunicationEvents.DispatchEventResult,
          payload: {
            event: ShardCommunicationResults.BroadcastResults,
            data: results,
          },
        };

        this.process.send(reply);
        break;
      }
      // Single shard send requested by the shard
      case ShardCommunicationActions.Send: {
        if (typeof message.payload !== 'object')
          throw new TypeError('Invalid type of payload when calling the shard send action');

        const { event, shardId } = message.payload as ShardCommunicationSendPayload;

        const result = await this.manager.send(event, shardId);
        const reply: ShardDispatchEvent = {
          action: ShardCommunicationEvents.DispatchEventResult,
          payload: {
            event: ShardCommunicationResults.SendResult,
            data: result,
          },
        };

        this.process.send(reply);
        break;
      }
      // The shard changed its state
      case 'shardChangedState': {
        this.state = message.payload.state;
        if (this.manager.checkShardsState(message.payload.state)) {
          this.manager.emitEvent(message.payload.botEvent, []);
        }
        break;
      }
    }
  }

  /**
   * Sends a message to the child process in order to emit a registered given event
   * @param {string} event The event to be emitted in the child process
   * @returns {Promise<Serializable>}
   */
  public communicate(event: string): Promise<Serializable> {
    return new Promise<Serializable>((resolve, reject) => {
      /*
      Create an identifier which will be returned from the next request.
      This is used to identify that we act on the right response instead of a child process request.
       */
      const identifier = Date.now();

      const listener = (message: ShardResponse): void => {
        // Check if the received message is indeed identified by our identifier
        if (
          typeof message === 'object' &&
          'identifier' in message &&
          message.identifier === identifier
        ) {
          // Resolve with the message data
          resolve(message.data);

          this.process.removeListener('message', listener);
        }
      };

      this.process.on('message', listener);

      const message: ShardDispatchEvent = {
        action: ShardCommunicationEvents.DispatchEvent,
        payload: { event },
        identifier,
      };

      this.process.send(message, err => {
        if (err) reject(err);
      });
    });
  }

  /**
   * Sends the child process a message to emit the given event to {@link BotEventsHandler}
   * @param {BotEvents} event The event to be emitted
   * @param {Args<Events, E>} args The arguments of the events
   */
  public emitEvent<E extends keyof Events>(event: E, args: Args<Events, E>): void {
    const message: ShardEmitEvent<E> = {
      action: 'emitEvent',
      payload: {
        event,
        args,
      },
    };

    this.process.send(message);
  }
}

export default BotShard;
