'use strict';

import { BotEvent, Permission } from '../../src/socket';
import { Bot, Guild } from '../../src/structures';
import { ChannelType } from '../../src/structures/channels';
import { PermissionFlags, PermissibleType } from '../../src/structures/flags';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const firstChannel = guild.channels.cache.first!;

  // Create a new channel
  const channel = await guild.channels.create({
    name: `hello-${guild.channels.cache.size}`,
    type: ChannelType.GuildText,
    position: 1,
    permissions: {
      [guild.members.cache.first!.id]: {
        type: PermissibleType.Member,
        allow: PermissionFlags.from(Permission.ViewChannel),
      },
      [bot.user!.id]: {
        type: PermissibleType.Member,
        allow: PermissionFlags.from(Permission.ViewChannel),
      },
      [guild.id]: {
        type: PermissibleType.Role,
        deny: PermissionFlags.from(Permission.ViewChannel),
      },
    },
  });

  console.log(channel.id);
  console.log((await guild.channels.fetch(channel.id)).id);
  console.log((await guild.channels.get(channel.id)).id);

  guild.channels.modifyPositions({ [channel.id]: 3, [firstChannel.id]: 1 });

  await bot.events.wait(BotEvent.ChannelUpdate);

  console.log(
    guild.channels.cache.get(channel.id)?.position === 3,
    "whether the created channel's position has been updated",
    'expected: true',
  ); // expected: true

  console.log(
    guild.channels.cache.get(firstChannel.id)?.position === 1,
    "whether the first channel's position has been updated",
    'expected: true',
  ); //expected: true

  await guild.channels.swap(channel, firstChannel);

  // eslint-disable-next-line no-constant-condition
  while (1) {
    await Promise.race([
      bot.events.wait(BotEvent.ChannelCreate),
      bot.events.wait(BotEvent.ChannelDelete),
    ]);

    // Compare all the guild's cached channels to all the bot's cached channels
    // Both should be equal on guild channel modifications
    console.log(
      bot.guilds.cache.toArray.reduce(
        (channels: number, guilds: Guild) => channels + guilds.channels.cache.size,
        0,
      ),
      bot.channels.cache.size,
    );
  }
})();

bot.events.on(BotEvent.Debug, console.log);
