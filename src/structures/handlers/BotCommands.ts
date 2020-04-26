import { EventEmitter } from 'events';
import BotHandler from './BotHandler';
import { Command, CommandFunction } from '../../types';

type RegisterCallback = CommandFunction | Command;

class BotCommands extends EventEmitter implements BotHandler<RegisterCallback> {
  public wait(name: string): Promise<unknown> {
    return;
  }
}

export default BotCommands;
