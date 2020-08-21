'use strict';

import { Help } from './Help';
import { Ping } from './Ping';
import { Bot } from '../../../src/bot';
import { BotEvent } from '../../../src/socket';
import { Message } from '../../../src/structures/message';
import config from '../../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  new Ping(bot);
  new Help(bot);

  bot.events.on(BotEvent.MessageCreate, (message: Message) => {
    bot.commands.execute(message.content, message, 'Hello');
  });
})();

bot.events.on(BotEvent.Debug, console.log);
