'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import DMChannel from '../../src/structures/channels/DMChannel';
import GuildTextChannel from '../../src/structures/channels/GuildTextChannel';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvents.Ready);

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

    // await message.removeReaction('✅');

    await message.removeReactions();
  }
})();

bot.events.on(BotEvents.Debug, console.log);
