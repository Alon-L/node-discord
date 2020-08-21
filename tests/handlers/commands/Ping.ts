import { HandlerEvent } from '../../../src/structures/bot/handlers';
import {
  Command,
  RegisterCommand,
  RegisterCommandHandler,
} from '../../../src/structures/bot/handlers/command';
import { Message } from '../../../src/structures/message';

@RegisterCommand({ name: 'ping' })
export class Ping extends Command {
  @RegisterCommandHandler(HandlerEvent.Execute)
  public a(message: Message, a: string): void {
    console.log('Pong!', message.content, a);
  }

  @RegisterCommandHandler(HandlerEvent.Before)
  public b(): void {
    console.log('Before ping!');
  }

  @RegisterCommandHandler(HandlerEvent.After)
  public c(): void {
    console.log('After ping!');
  }
}
