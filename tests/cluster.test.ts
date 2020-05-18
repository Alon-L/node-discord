'use strict';

import Cluster from '../src/Cluster';

const cluster = new Cluster<string, number>();

cluster.set('1', 1);
cluster.set('2', 2);
cluster.set('3', 3);

const initialSize = cluster.size;

test('cluster filter', () => {
  const filtered = cluster.filter(v => v > 1);

  expect(filtered.size).toBe(cluster.size - 1);
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

test('cluster limit', () => {
  const cluster = new Cluster<string, number>(null, 3);
  cluster.set('1', 1);
  cluster.set('2', 2);
  cluster.set('3', 3);
  cluster.set('4', 4);

  expect(cluster.size).toBe(3);

  cluster.set('5', 5, { force: true });

  expect(cluster.size).toBe(4);
  expect(cluster.first).toBe(1);

  cluster.set('6', 6, { shift: true });

  expect(cluster.size).toBe(4);
  expect(cluster.first).toBe(2);
});
