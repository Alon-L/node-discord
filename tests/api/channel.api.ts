'use strict';

import { BotEvent } from '../../src/socket/constants';
import Emoji from '../../src/structures/Emoji';
import Bot from '../../src/structures/bot/Bot';
import DMChannel from '../../src/structures/channels/DMChannel';
import GuildTextChannel from '../../src/structures/channels/GuildTextChannel';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const channel = bot.guilds.get('702476896008405002')?.channels.get('721781755060813914');
  if (!channel) return;

  // console.log(await channel.delete());

  if (channel instanceof GuildTextChannel || channel instanceof DMChannel) {
    const message = await channel.sendMessage(
      {
        content: 'Message content!',
        embed: {
          description: 'Hello World!',
          author: {
            name: 'HELLO!',
            iconURL: bot.users.get('237470577298898946')?.avatarURL(),
          },
        },
      },
      {
        nonce: 'Hello',
      },
    );

    await message.addReaction('✅');
    await message.addReaction('706847974612795433');

    await message.removeReaction('✅');

    await message.reactions.get(Emoji.resolve(bot.emojis, '706847974612795433')!)?.remove();

    await message.removeReactions();

    await message.edit('Edited message!');
    await message.edit({
      content: 'Edited message content again!',
      embed: {
        title: 'Edited title!',
      },
    });

    await message.delete();

    bot.events
      .wait(BotEvent.MessageDelete)
      .then(() => console.log(message.deleted) /* expected: true */);

    console.log(message.reactions.toArrayKeys);
  }
})();

bot.events.on(BotEvent.Debug, console.log);
