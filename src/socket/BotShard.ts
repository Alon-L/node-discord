import { ChildProcess, fork, Serializable } from 'child_process';
import path from 'path';
import { BotShardManager } from './BotShardManager';
import { GatewayCloseCode } from './constants';
import {
  BotCommunication,
  ShardBroadcastRequest,
  ShardChangedStateRequest,
  ShardCommunicationAction,
  ShardCommunicationActionResponse,
  ShardCommunicationActionResponses,
  ShardCommunicationEmitEvents,
  ShardDisconnectAllRequest,
  ShardEmitBotEventRequest,
  ShardEmitCommunicationEventRequest,
  ShardEmitCommunicationEventResponse,
  ShardEmitDisconnectRequest,
  ShardSendRequest,
} from '../structures/bot';
import { Events } from '../structures/bot/handlers/events/events';
import { ShardId } from '../types';
import { Args } from '../types/EventEmitter';

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
export class BotShard {
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
   * @param {ShardBroadcastRequest | ShardSendRequest | ShardChangedStateRequest} request The request received from the child process
   * @returns {Promise<void>}
   */
  public async onMessage(
    request:
      | ShardBroadcastRequest
      | ShardSendRequest
      | ShardChangedStateRequest
      | ShardDisconnectAllRequest,
  ): Promise<void> {
    const { identifier } = request;

    switch (request.action) {
      // Broadcast requested by the shard
      case ShardCommunicationAction.Broadcast: {
        const results = await this.manager.broadcast(request.payload);

        const response: ShardCommunicationActionResponse = {
          payload: {
            event: ShardCommunicationActionResponses.BroadcastResponses,
            data: results,
          },
          identifier,
        };

        this.process.send(response);
        break;
      }
      // Single shard send requested by the shard
      case ShardCommunicationAction.Send: {
        const { event, shardId } = request.payload;

        const result = await this.manager.send(event, shardId);

        const response: ShardCommunicationActionResponse = {
          payload: {
            event: ShardCommunicationActionResponses.SendResponse,
            data: result,
          },
          identifier,
        };

        this.process.send(response);
        break;
      }
      // The shard changed its state
      case ShardCommunicationAction.ShardChangedState: {
        this.state = request.payload.state;
        if (this.manager.checkShardsState(request.payload.state)) {
          this.manager.emitEvent(request.payload.botEvent, []);
        }
        break;
      }
      // The shard requests all connected shards to disconnect
      case ShardCommunicationAction.DisconnectAll: {
        await this.manager.disconnectAll(request.payload);
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
      const { identifier } = BotCommunication;

      const listener = ({
        payload: { data },
        identifier: responseIdentifier,
      }: ShardEmitCommunicationEventResponse): void => {
        // Check if the received message is indeed identified by our identifier
        if (identifier === responseIdentifier) {
          // Resolve with the message data
          resolve(data);

          this.process.removeListener('message', listener);
        }
      };

      this.process.on('message', listener);

      const request: ShardEmitCommunicationEventRequest = {
        action: ShardCommunicationEmitEvents.EmitCommunicationEvent,
        payload: { event },
        identifier,
      };

      this.process.send(request, err => {
        if (err) reject(err);
      });
    });
  }

  /**
   * Sends the child process a message to emit the given event to {@link BotEventsHandler}
   * @param {E} event The event to be emitted
   * @param {Args<Events, E>} args The arguments of the events
   */
  public emitEvent<E extends keyof Events>(event: E, args: Args<Events, E>): void {
    const request: ShardEmitBotEventRequest<E> = {
      action: ShardCommunicationEmitEvents.EmitBotEvent,
      payload: {
        event,
        args,
      },
      identifier: Date.now(),
    };

    this.process.send(request);
  }

  /**
   * Disconnects this shard
   * @param {GatewayCloseCode} code The shard close code
   */
  public disconnect(code: GatewayCloseCode): void {
    const request: ShardEmitDisconnectRequest = {
      action: ShardCommunicationEmitEvents.EmitDisconnect,
      payload: code,
      identifier: Date.now(),
    };

    this.process.send(request);
  }
}
