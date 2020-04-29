'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvents.Ready);

  bot.events.on(BotEvents.ChannelPinsUpdate, (channel, oldPinTimestamp) => {
    console.log(channel.name, channel.type);
    console.log('old', oldPinTimestamp.unix(), 'new', channel.lastPinTimestamp.unix(), Date.now());
  });
})();
