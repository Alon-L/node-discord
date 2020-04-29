import BotHandler from './BotHandler';
import { Command, CommandFunction } from '../../../types';

type RegisterCallback = CommandFunction | Command;

class BotCommandsHandler extends BotHandler<RegisterCallback> {
  constructor() {
    super();
  }

  public async wait(name: string): Promise<unknown> {
    return;
  }
}

export default BotCommandsHandler;
