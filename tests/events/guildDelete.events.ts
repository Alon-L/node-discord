'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import GuildUnavailable from '../../src/structures/guild/GuildUnavailable';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildDelete, (guild: Guild | GuildUnavailable) => {
    if (guild instanceof GuildUnavailable) {
      console.log(guild.unavailable);
    } else {
      console.log(guild.name);
    }
  });

  await bot.events.wait(BotEvents.Ready);
})();
