'use strict';

import { BotEvent } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import GuildUnavailable from '../../src/structures/guild/GuildUnavailable';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.GuildUpdate,
    (before: Guild | GuildUnavailable, after: Guild | GuildUnavailable) => {
      if (before instanceof Guild && after instanceof Guild) {
        console.log(before.name, after.name);
      } else {
        console.log(before.unavailable, after.unavailable);
      }
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
