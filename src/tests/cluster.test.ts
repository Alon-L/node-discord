'use strict';

import Cluster from '../Cluster';

const cluster = new Cluster<string, number>();

cluster.set('1', 1);
cluster.set('2', 2);
cluster.set('3', 3);

test('cluster filter', () => {
  const filtered = cluster.filter((v) => v > 1);

  expect(filtered.size).toBe(2);
});
