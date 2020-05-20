'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Message from '../../src/structures/message/Message';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.MessageUpdate, (oldMessage: Message | undefined, newMessage: Message) => {
    console.log(
      oldMessage?.content,
      newMessage.content,
      oldMessage?.id === newMessage.id,
      newMessage.channel.messages.toArrayKeys,
    );
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
