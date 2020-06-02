'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import MessageReaction from '../../src/structures/message/MessageReaction';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.MessageReactionRemoveEmoji, (reaction: MessageReaction | undefined) => {
    console.log(
      reaction?.message.content,
      reaction?.count,
      reaction?.message.reactions.toArrayKeys,
    );
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
