import { BotEvent } from '../../../src/socket';
import { Bot, Message, PartialMessage } from '../../../src/structures';
import { HandlerEvent } from '../../../src/structures/bot/handlers/Handler';
import { Event } from '../../../src/structures/bot/handlers/events';

export class MessageDelete extends Event<BotEvent.MessageDelete> {
  constructor(bot: Bot) {
    super(bot, { name: BotEvent.MessageDelete });

    this.registerHandler(HandlerEvent.Execute, this.a);
    this.registerHandler(HandlerEvent.Before, this.b);
    this.registerHandler(HandlerEvent.After, this.c);
  }

  public a(message: Message | PartialMessage): void {
    console.log('On Message delete!', message.id);
  }

  public b(): void {
    console.log('On before Message delete!');
  }

  public c(): void {
    console.log('On after Message delete!');
  }
}
