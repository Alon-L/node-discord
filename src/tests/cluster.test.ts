'use strict';

import Cluster from '../Cluster';

const cluster = new Cluster<string, number>();

cluster.set('1', 1);
cluster.set('2', 2);
cluster.set('3', 3);

const initialSize = cluster.size;

test('cluster filter', () => {
  const filtered = cluster.filter(v => v > 1);

  expect(filtered.size).toBe(cluster.size - filtered.size);
});

describe('cluster merging', () => {
  test('cluster merge cluster', () => {
    const cluster2 = new Cluster<string, number>([['4', 4]]);

    cluster.merge(cluster2);

    expect(cluster.size).toBe(initialSize + cluster2.size);
  });

  test('cluster merge array', () => {
    const cluster2: [string, number][] = [['4', 4]];

    cluster.merge(cluster2);

    expect(cluster.size).toBe(initialSize + cluster2.length);
  });

  test('cluster merge arrays and clusters', () => {
    const cluster2: [string, number][] = [['4', 4]];
    const cluster3: [string, number][] = [
      ['5', 5],
      ['6', 6],
    ];
    const cluster4 = new Cluster<string, number>([['7', 7]]);

    cluster.merge(cluster2, cluster3, cluster4);

    expect(cluster.size).toBe(initialSize + cluster2.length + cluster3.length + cluster4.size);
  });
});
