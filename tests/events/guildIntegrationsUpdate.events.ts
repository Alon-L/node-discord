'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildIntegrationsUpdate, (guild: Guild) => {
    console.log(guild.name);
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
