'use strict';

import { BotEvent } from '../../src/socket';
import { Bot, MessageReaction } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.MessageReactionRemoveEmoji, (reaction: MessageReaction | undefined) => {
    console.log(
      reaction?.message.content,
      reaction?.count,
      reaction?.message.reactions.cache.toArrayKeys,
    );
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
