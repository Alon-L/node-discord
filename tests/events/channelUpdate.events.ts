'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import GuildChannel from '../../src/structures/channels/GuildChannel';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.ChannelUpdate, (before: GuildChannel, after: GuildChannel) => {
    if (before instanceof GuildChannel && after instanceof GuildChannel) {
      console.log(before.name, after.name);
    }
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
