'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures/bot';
import { Message, PartialMessage } from '../../src/structures/message';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.MessageDelete, (message: Message | PartialMessage) => {
    if (message instanceof Message) {
      console.log(message.id, message.content);
    } else {
      console.log(message.id, message.guild?.id, message.channel.id);
    }
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
