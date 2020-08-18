'use strict';

import assert from 'assert';
import { BotEvent, Permission } from '../../src/socket';
import { Bot, PermissionFlags } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const roles = await guild.roles.fetchAll();

  console.log(
    assert.deepStrictEqual(guild.roles.cache.toArrayEntries, roles.toArrayEntries),
    'whether the fetched roles match the cached ones',
    'expected: undefined',
  ); // expected: undefined

  const role = guild.roles.create({
    name: 'role name!',
    mentionable: true,
    listedSeparately: true,
    permissions: PermissionFlags.build(Permission.ManageRoles, Permission.ManageChannels),
    color: 0xffffff,
  });
  await bot.events.wait(BotEvent.GuildRoleCreate);

  console.log(
    guild.roles.cache.last?.name === (await role).name,
    'whether the last role matches the created one',
    'expected: true',
  ); // expected: true

  const last = guild.roles.cache.last!;
  const newPosition = last.position + 1;

  guild.roles.modifyPositions({ [last.id]: newPosition });
  await bot.events.wait(BotEvent.GuildRoleUpdate);

  console.log(
    last.position === newPosition,
    'whether the role is now at its new position',
    'expected: true',
  ); // expected: true
})();

bot.events.on(BotEvent.Debug, console.log);
