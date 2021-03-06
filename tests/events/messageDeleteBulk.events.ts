'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { Message } from '../../src/structures/message';
import { Snowflake, TextBasedChannel } from '../../src/types';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.MessageDeleteBulk,
    (channel: TextBasedChannel, messages: (Message | Snowflake)[]) => {
      console.log(
        channel.id,
        messages.map(message => (message instanceof Message ? `${message.id} - message` : message)),
      );
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
