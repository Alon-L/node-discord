'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import GuildChannel from '../../src/structures/channels/GuildChannel';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.ChannelUpdate, (oldChannel: GuildChannel, newChannel: GuildChannel) => {
    if (oldChannel instanceof GuildChannel && newChannel instanceof GuildChannel) {
      console.log(oldChannel.name, newChannel.name);
    }
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
