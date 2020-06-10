'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import GuildUnavailable from '../../src/structures/guild/GuildUnavailable';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvents.GuildUpdate,
    (before: Guild | GuildUnavailable, after: Guild | GuildUnavailable) => {
      if (before instanceof Guild && after instanceof Guild) {
        console.log(before.name, after.name);
      } else {
        console.log(before.unavailable, after.unavailable);
      }
    },
  );

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
