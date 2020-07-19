'use strict';

import { BotEvent } from '../../src/socket/constants';
import Emoji from '../../src/structures/Emoji';
import Bot from '../../src/structures/bot/Bot';
import DMChannel from '../../src/structures/channels/DMChannel';
import GuildTextChannel from '../../src/structures/channels/GuildTextChannel';
import Message from '../../src/structures/message/Message';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const channel = bot.guilds.get('702476896008405002')?.channels.get('721781755060813914');
  if (!channel) return;

  // console.log(await channel.delete());

  if (channel instanceof GuildTextChannel || channel instanceof DMChannel) {
    // Send a message in the channel
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

    // React with the white check mark emoji
    await message.addReaction('✅');

    // React with a custom emoji
    await message.addReaction(message.guild!.emojis.first!.id!);

    // Remove the white check mark emoji reaction
    await message.removeReaction('✅');

    // Remove the custom emoji reaction from the message
    await message.reactions
      .get(Emoji.resolve(bot.emojis, message.guild!.emojis.first!.id!)!)
      ?.remove();

    // Remove all reactions from the message
    await message.removeReactions();

    console.log(message.reactions.size, 'message.reactions.size', 'expected: 0'); // expected: 0

    // Edit the message
    await message.edit('Edited message!');

    // Edit the message with an embed
    await message.edit({
      content: 'Edited message content again!',
      embed: {
        title: 'Edited title!',
      },
    });

    // Delete the message
    message.delete();

    await bot.events.wait(BotEvent.MessageDelete);
    console.log(message.deleted, 'message.deleted', 'expected: true'); // expected: true

    if (channel instanceof GuildTextChannel) {
      // Send dummy messages for bulk delete
      await channel.sendMessage('Message 1');
      await channel.sendMessage('Message 2');
      await channel.sendMessage('Message 3');

      // Bulk delete the sent messages
      channel.bulkDeleteMessages(channel.messages.map(message => message.id).toArray);

      await bot.events.wait(BotEvent.MessageDeleteBulk);

      console.log(
        channel.messages.filter(message => !message.deleted).size,
        'number of cached not deleted messages in the channel',
        'expected: 0',
      ); // expected: 0

      // Trigger typing indicator
      await channel.triggerTyping();

      const message = await new Promise<Message>(resolve => {
        setTimeout(async () => resolve(await channel.sendMessage('Hello!')), 2000); // Send a message once the timeout is over
      });

      // Pin the message
      channel.pinMessage(message.id);

      await bot.events.wait(BotEvent.MessageUpdate);

      console.log(message.pinned, 'message.pinned', 'expected: true');

      // Unpin the message
      message.unpin();

      await bot.events.wait(BotEvent.MessageUpdate);

      console.log(message.pinned, 'message.pinned', 'expected: false');
    }
  }
})();

bot.events.on(BotEvent.Debug, console.log);
