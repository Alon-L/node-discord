'use strict';

import config from './config.json';
import { BotEvent } from '../src/socket';
import { Bot } from '../src/structures/bot';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const channelId = '707607008781795398' || bot.guilds.cache.first?.channels.cache.first?.id;

  if (!channelId) {
    throw new Error('No channel ID');
  }

  for (let i = 0; i < 7; i++) {
    bot.api.sendMessage(
      channelId,
      {
        content: `Hello, World! ${i}`,
        embed: {
          title: 'Hello, Embed!',
          description: 'This is an embedded message.',
        },
      },
      {
        tts: false,
      },
    );
  }
})();

bot.events.on(BotEvent.Debug, console.log);
