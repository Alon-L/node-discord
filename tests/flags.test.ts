'use strict';

import { Permission } from '../src/socket/constants';
import PermissionFlags from '../src/structures/flags/PermissionFlags';

test('build permission flags', () => {
  const permissions: Permission[] = [
    Permission.ManageChannels,
    Permission.SendMessages,
    Permission.ViewChannel,
  ];

  const flags = PermissionFlags.build(...permissions);

  for (const permission of permissions) {
    expect(flags.has(permission)).toBeTruthy();
  }

  expect(flags.has(Permission.Administrator)).toBeFalsy();
});
