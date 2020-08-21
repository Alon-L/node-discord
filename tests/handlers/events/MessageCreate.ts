import { HandlerEvent } from '../../../src/bot/handlers';
import { RegisterEvent, RegisterEventHandler, Event } from '../../../src/bot/handlers/events';
import { BotEvent } from '../../../src/socket';
import { Message } from '../../../src/structures/message';

@RegisterEvent({ name: BotEvent.MessageCreate })
export class MessageCreate extends Event<BotEvent.MessageCreate> {
  @RegisterEventHandler(HandlerEvent.Execute)
  public a(message: Message): void {
    console.log('On Message create!', message.content);
  }

  @RegisterEventHandler(HandlerEvent.Before)
  public b(): void {
    console.log('On before Message create!');
  }

  @RegisterEventHandler(HandlerEvent.After)
  public c(): void {
    console.log('On after Message create!');
  }
}
