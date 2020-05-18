'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Message from '../../src/structures/message/Message';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.MessageCreate, (message: Message) => {
    console.log(
      message.id,
      message.author.id,
      message.channel.type,
      message.mentions.channels,
      message.mentions.channels?.size,
      message.mentions.channels?.toArrayKeys,
      message.mentions.members,
      message.mentions.users,
      message.content,
      message.attachments.first?.dimensions,
      message.embeds,
      message.type,
    );
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
