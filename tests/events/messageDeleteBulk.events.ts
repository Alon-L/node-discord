'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Message from '../../src/structures/message/Message';
import { Snowflake, TextBasedChannel } from '../../src/types/types';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvents.MessageDeleteBulk,
    (channel: TextBasedChannel, messages: (Message | Snowflake)[]) => {
      console.log(
        channel.id,
        messages.map(message => (message instanceof Message ? `${message.id} - message` : message)),
      );
    },
  );

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
