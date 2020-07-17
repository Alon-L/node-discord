'use strict';

import { BotEvent } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import MessageReaction from '../../src/structures/message/MessageReaction';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.MessageReactionRemoveEmoji, (reaction: MessageReaction | undefined) => {
    console.log(
      reaction?.message.content,
      reaction?.count,
      reaction?.message.reactions.toArrayKeys,
    );
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
