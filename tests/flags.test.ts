'use strict';

import { PermissionFlags, Permission } from '../src/structures/flags';

test('from permission flags', () => {
  const permissions: Permission[] = [
    Permission.ManageChannels,
    Permission.SendMessages,
    Permission.ViewChannel,
  ];

  const flags = PermissionFlags.from(...permissions);

  for (const permission of permissions) {
    expect(flags.has(permission)).toBeTruthy();
  }

  expect(flags.has(Permission.Administrator)).toBeFalsy();
});
