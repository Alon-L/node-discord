'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures/bot';
import { Guild, GuildUnavailable } from '../../src/structures/guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildCreate, (guild: Guild | GuildUnavailable) => {
    if (guild instanceof Guild) {
      console.log(guild.name, guild.id);
      console.log(bot.guilds.cache.get(guild.id)?.name === guild.name);
    }
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
