'use strict';

import { BotEvent } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guildChannel = bot.guilds.get('702476896008405002')?.channels.get('707607008781795398');
  if (!guildChannel) return;

  console.log(
    await guildChannel.modify({
      name: guildChannel.name + 'a',
      topic: guildChannel.topic ? guildChannel.topic + 'a' : 'a',
    }),
  );
})();

bot.events.on(BotEvent.Debug, console.log);
