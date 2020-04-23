import fs from 'fs';
import path from 'path';
import { GatewayEvents } from './BotSocket';
import Cluster from '../Cluster';
import Bot from '../structures/Bot';

export type EventFunction = (bot: Bot) => void;

export interface Event {
  run: EventFunction;
  name: GatewayEvents;
}

class BotDispatchHandlers {
  public static readonly events = new Cluster<GatewayEvents, EventFunction>();
  private readonly eventsPath: string;

  constructor() {
    this.eventsPath = path.join(__dirname, './events/');
  }

  private fetchEvents(): Promise<Event[]> {
    const eventFiles = fs.readdirSync(this.eventsPath);
    const events: Promise<Event>[] = [];

    for (const eventFile of eventFiles) {
      events.push(import(path.join(this.eventsPath, eventFile)));
    }

    return Promise.all(events);
  }

  public async registerEvents(): Promise<void> {
    const events = await this.fetchEvents();

    for (const { name, run } of events) {
      BotDispatchHandlers.events.set(name, run);
    }
  }
}

export default BotDispatchHandlers;
