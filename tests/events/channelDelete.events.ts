'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import GuildChannel from '../../src/structures/channels/GuildChannel';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.ChannelDelete, (channel: GuildChannel) => {
    if (channel instanceof GuildChannel) {
      console.log(channel.name, channel.guild.channels.get(channel.id));
    }
  });

  await bot.events.wait(BotEvents.Ready);
})();
