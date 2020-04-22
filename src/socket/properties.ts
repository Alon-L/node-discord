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
  // eslint-disable-next-line @typescript-eslint/camelcase
  large_threshold: 250,
  version,
};

export default {
  baseURL: 'https://discordapp.com/api/v6',
};
