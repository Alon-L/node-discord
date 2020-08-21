'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { GuildChannel } from '../../src/structures/channels';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.WebhooksUpdate, (channel: GuildChannel) => {
    console.log(channel.name, channel.guild.name);
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
