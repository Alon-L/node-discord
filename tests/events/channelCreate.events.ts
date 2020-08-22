'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { Channel } from '../../src/structures/channels';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.ChannelCreate, (channel: Channel) => {
    console.log(channel.id, channel.type);
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
