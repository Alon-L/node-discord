'use strict';

import { BotEvent, Permission } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import { ChannelType } from '../../src/structures/channels/Channel';
import PermissionFlags, { PermissibleType } from '../../src/structures/flags/PermissionFlags';
import Guild from '../../src/structures/guild/Guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = bot.guilds.cache.first;
  if (!guild) throw new Error('No guilds found');

  // Create a new channel
  const channel = await guild.channels.create({
    name: 'hello',
    type: ChannelType.GuildText,
    position: 1,
    permissions: {
      [guild.members.first!.id]: {
        type: PermissibleType.Member,
        allow: PermissionFlags.build(Permission.ViewChannel),
      },
      [bot.user!.id]: {
        type: PermissibleType.Member,
        allow: PermissionFlags.build(Permission.ViewChannel),
      },
      [guild.id]: {
        type: PermissibleType.Role,
        deny: PermissionFlags.build(Permission.ViewChannel),
      },
    },
  });

  console.log(channel.id);
  console.log((await guild.channels.fetch(channel.id)).id);
  console.log((await guild.channels.get(channel.id)).id);

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
