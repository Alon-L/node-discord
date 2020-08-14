import { Message } from '../../src/structures';
import {
  Command,
  CommandEvent,
  RegisterCommand,
  RegisterEvent,
} from '../../src/structures/bot/command';

@RegisterCommand({ name: 'ping' })
export class Ping extends Command {
  @RegisterEvent(CommandEvent.Execute)
  public a(message: Message, a: string): void {
    console.log('Pong!', message.content, a);
  }

  @RegisterEvent(CommandEvent.Before)
  public b(): void {
    console.log('Before ping!');
  }

  @RegisterEvent(CommandEvent.After)
  public c(): void {
    console.log('After ping!');
  }
}
