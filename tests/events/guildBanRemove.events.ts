'use strict';

import { BotEvents } from '../../src/socket/constants';
import User from '../../src/structures/User';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import GuildUnavailable from '../../src/structures/guild/GuildUnavailable';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildBanRemove, (guild: Guild | GuildUnavailable, user: User) => {
    if (guild instanceof Guild) {
      console.log(guild.name, user.username);
    }
  });

  await bot.events.wait(BotEvents.Ready);
})();
