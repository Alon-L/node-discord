'use strict';

import { BotEvent } from '../../src/socket';
import { Bot, Message } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.MessageReactionRemoveAll, (message: Message) => {
    console.log(message.reactions.cache.size, message.id, message.content);
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
