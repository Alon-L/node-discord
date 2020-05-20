'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Message, { PartialMessage } from '../../src/structures/message/Message';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.MessageDelete, (message: Message | PartialMessage) => {
    if (message instanceof Message) {
      console.log(message.id, message.content);
    } else {
      console.log(message.id, message.guild?.id, message.channel.id);
    }
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
