'use strict';

import { MessageCreate } from './MessageCreate';
import { BotEvent } from '../../../src/socket';
import { Bot } from '../../../src/structures';
import config from '../../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  new MessageCreate(bot);
})();

bot.events.on(BotEvent.Debug, console.log);
