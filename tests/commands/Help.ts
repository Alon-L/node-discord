import { Bot, CommandEvent, Message } from '../../src/structures';
import { Command } from '../../src/structures/bot/command';

export class Help extends Command {
  constructor(bot: Bot) {
    super(bot, { name: 'help' });

    this.registerEvent(CommandEvent.Execute, this.a);
    this.registerEvent(CommandEvent.Before, this.b);
    this.registerEvent(CommandEvent.After, this.c);
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
