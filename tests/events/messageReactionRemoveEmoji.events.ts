'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { MessageReaction } from '../../src/structures/message';
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
