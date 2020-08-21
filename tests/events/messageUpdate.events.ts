'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures/bot';
import { Message } from '../../src/structures/message';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.MessageUpdate, (before: Message | undefined, after: Message) => {
    console.log(
      before?.content,
      after.content,
      before?.id === after.id,
      after.channel.messages.cache.toArrayKeys,
    );
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
