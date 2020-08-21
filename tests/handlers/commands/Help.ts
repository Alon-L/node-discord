import { Bot } from '../../../src/bot';
import { HandlerEvent } from '../../../src/bot/handlers';
import { Command } from '../../../src/bot/handlers/command';
import { Message } from '../../../src/structures/message';

export class Help extends Command {
  constructor(bot: Bot) {
    super(bot, { name: 'help' });

    this.registerHandler(HandlerEvent.Execute, this.a);
    this.registerHandler(HandlerEvent.Before, this.b);
    this.registerHandler(HandlerEvent.After, this.c);
  }

  public a(message: Message): void {
    console.log('Help!!', message.content);
  }

  public b(): void {
    console.log('Before help!');
  }

  public c(): void {
    console.log('After help!');
  }
}
