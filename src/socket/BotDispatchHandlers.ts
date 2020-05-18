import fs from 'fs';
import path from 'path';
import BotSocketShard, { Payload } from './BotSocketShard';
import { GatewayEvents } from './constants';
import Cluster from '../Cluster';
import Bot from '../structures/bot/Bot';

export type EventFunction = (payload: Payload, bot: Bot, socket: BotSocketShard) => void;

export interface Event {
  run: EventFunction;
  name: GatewayEvents;
}

/**
 * Registers an event for every event shown here https://discordapp.com/developers/docs/topics/gateway#commands-and-events-gateway-events
 * @class
 */
class BotDispatchHandlers {
  public static readonly events = new Cluster<GatewayEvents, EventFunction>();
  private readonly eventsPath: string;

  constructor() {
    this.eventsPath = path.join(__dirname, './handlers/');
  }

  /**
   * Imports every handler file found in the handlers directory
   * @returns {Promise<Event[]>}
   */
  private fetchEvents(): Promise<Event[]> {
    const eventFiles = fs.readdirSync(this.eventsPath);
    const events: Promise<Event>[] = [];

    for (const eventFile of eventFiles) {
      events.push(import(path.join(this.eventsPath, eventFile)));
    }

    return Promise.all(events);
  }

  /**
   * Registers every one of the found events into the {@link BotDispatchHandlers.events} Cluster
   * @returns {Promise<void>}
   */
  public async registerEvents(): Promise<void> {
    const events = await this.fetchEvents();
    console.log(events);

    for (const { name, run } of events) {
      BotDispatchHandlers.events.set(name, run);
    }
  }

  /**
   * Deletes all registered events
   */
  public clearEvents(): void {
    BotDispatchHandlers.events.clear();
  }
}

export default BotDispatchHandlers;
