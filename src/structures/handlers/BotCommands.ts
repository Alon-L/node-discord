import BotHandler from './BotHandler';
import { Command, CommandFunction } from '../../types';
import Bot from '../bot/Bot';

type RegisterCallback = CommandFunction | Command;

class BotCommands extends BotHandler<RegisterCallback> {
  constructor(bot: Bot) {
    super(bot);
  }

  public async wait(name: string): Promise<unknown> {
    return;
  }
}

export default BotCommands;
