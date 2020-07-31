'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
import { Guild, GuildUnavailable } from '../../src/structures/guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildDelete, (guild: Guild | GuildUnavailable) => {
    if (guild instanceof GuildUnavailable) {
      console.log(guild.unavailable);
    } else {
      console.log(guild.name);
    }
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
