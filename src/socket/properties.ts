export const version = 6;

export const identify = {
  properties: {
    $os: process.platform,
    $browser: 'node-discord',
    $device: 'node-discord',
  },
  presence: {
    status: 'online',
  },
  large_threshold: 250,
  version,
};

export default {
  baseURL: 'https://discord.com/api/v6',
};
