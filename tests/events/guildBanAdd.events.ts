'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { GuildBan } from '../../src/structures/guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildBanAdd, (ban: GuildBan) => {
    console.log(ban.guild.name, ban.user.username);
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
