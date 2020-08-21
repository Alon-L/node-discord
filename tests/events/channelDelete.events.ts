'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures/bot';
import { Channel, GuildChannel } from '../../src/structures/channels';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.ChannelDelete, (channel: Channel) => {
    if (channel instanceof GuildChannel) {
      console.log(channel.name, channel.guild.channels.get(channel.id));
    }
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
