'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.ChannelUpdate, (oldChannel, newChannel) => {
    console.log(oldChannel.name, newChannel.name);
  });

  await bot.events.wait(BotEvents.Ready);
})();
