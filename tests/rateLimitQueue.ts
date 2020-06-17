'use strict';

import config from './config.json';
import { BotEvents } from '../src/socket/constants';
import Bot from '../src/structures/bot/Bot';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvents.Ready);

  const channelId = '707607008781795398' || bot.guilds.first?.channels.first?.id;

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

bot.events.on(BotEvents.Debug, console.log);
