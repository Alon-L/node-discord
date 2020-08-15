'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
import { GuildBan } from '../../src/structures/guild/GuildBan';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildBanRemove, (ban: GuildBan | undefined) => {
    if (ban) {
      console.log(ban.guild.name, ban.user.username);
    }
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
