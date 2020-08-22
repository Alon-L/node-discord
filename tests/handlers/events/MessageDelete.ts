import { Bot } from '../../../src/bot';
import { HandlerEvent } from '../../../src/bot/handlers';
import { Event } from '../../../src/bot/handlers/events';
import { BotEvent } from '../../../src/socket';
import { PartialMessage, Message } from '../../../src/structures/message';

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
