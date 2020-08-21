'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures/bot';
import { Channel, GuildChannel } from '../../src/structures/channels';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.ChannelUpdate, (before: Channel, after: Channel) => {
    if (before instanceof GuildChannel && after instanceof GuildChannel) {
      console.log(before.name, after.name);
    } else {
      console.log(before.type, after.type);
    }
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
