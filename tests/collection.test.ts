'use strict';

import Collection from '../src/Collection';

const collection = new Collection<string, number>();

collection.set('1', 1);
collection.set('2', 2);
collection.set('3', 3);

const initialSize = collection.size;

test('collection filter', () => {
  const filtered = collection.filter(v => v > 1);

  expect(filtered.size).toBe(collection.size - 1);
});

describe('collection merging', () => {
  test('collection merge collection', () => {
    const collection2 = new Collection<string, number>([['4', 4]]);

    collection.merge(collection2);

    expect(collection.size).toBe(initialSize + collection2.size);
  });

  test('collection merge array', () => {
    const collection2: [string, number][] = [['4', 4]];

    collection.merge(collection2);

    expect(collection.size).toBe(initialSize + collection2.length);
  });

  test('collection merge arrays and collections', () => {
    const collection2: [string, number][] = [['4', 4]];
    const collection3: [string, number][] = [
      ['5', 5],
      ['6', 6],
    ];
    const collection4 = new Collection<string, number>([['7', 7]]);

    collection.merge(collection2, collection3, collection4);

    expect(collection.size).toBe(
      initialSize + collection2.length + collection3.length + collection4.size,
    );
  });
});

test('collection limit', () => {
  const collection = new Collection<string, number>(null, 3);
  collection.set('1', 1);
  collection.set('2', 2);
  collection.set('3', 3);
  collection.set('4', 4);

  expect(collection.size).toBe(3);

  collection.set('5', 5, true);

  expect(collection.size).toBe(4);
  expect(collection.first).toBe(2);

  collection.set('6', 6);

  expect(collection.size).toBe(4);
  expect(collection.first).toBe(3);
});
