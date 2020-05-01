'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Channel from '../../src/structures/channels/Channel';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.ChannelCreate, (channel: Channel) => {
    console.log(channel.id, channel.type);
  });

  await bot.events.wait(BotEvents.Ready);
})();
