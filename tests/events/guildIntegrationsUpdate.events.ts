'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { Guild } from '../../src/structures/guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildIntegrationsUpdate, (guild: Guild) => {
    console.log(guild.name);
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
