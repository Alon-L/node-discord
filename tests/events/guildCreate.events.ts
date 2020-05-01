'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildCreate, (guild: Guild) => {
    console.log(guild.name, guild.id);
    console.log(bot.guilds.get(guild.id)?.name === guild.name);
  });

  await bot.events.wait(BotEvents.Ready);
})();
