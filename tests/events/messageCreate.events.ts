'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Message from '../../src/structures/message/Message';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.MessageCreate, (message: Message) => {
    console.log(message.id, message.author.id, message.channel.type, message.mentions.members);
  });

  await bot.events.wait(BotEvents.Ready);
})();
