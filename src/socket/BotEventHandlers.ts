import fs from 'fs';
import path from 'path';
import { GatewayEvents } from './BotSocket';

export type EventFunction = () => void;

export interface Event {
  run: EventFunction;
  name: GatewayEvents;
}

class BotEventHandlers {
  // TODO: Turn this into a Cluster
  public static events: Record<GatewayEvents, EventFunction>;
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
      BotEventHandlers.events[name] = run;
    }
  }
}

export default BotEventHandlers;
