import { BotEvent } from '../../../src/socket';
import { Message } from '../../../src/structures';
import { HandlerEvent } from '../../../src/structures/bot/handlers/Handler';
import {
  RegisterEvent,
  RegisterEventHandler,
  Event,
} from '../../../src/structures/bot/handlers/events';

@RegisterEvent({ name: BotEvent.MessageCreate })
export class MessageCreate extends Event<BotEvent.MessageCreate> {
  @RegisterEventHandler(HandlerEvent.Execute)
  public a(message: Message): void {
    console.log('On Message!', message.content);
  }

  @RegisterEventHandler(HandlerEvent.Before)
  public b(): void {
    console.log('On before Message!');
  }

  @RegisterEventHandler(HandlerEvent.After)
  public c(): void {
    console.log('On after Message!');
  }
}
