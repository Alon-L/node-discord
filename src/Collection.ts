/**
 * Collections serve as data holders throughout the library.
 * They are a combination of JavaScript Maps and Arrays with the
 * ability to hold large amount of data.
 * @template K, V
 */
class Collection<K, V> extends Map<K, V> {
  /**
   * The maximum number of items allowed in this Collection
   */
  public readonly limit: number | null | undefined;

  constructor(entries?: Iterable<readonly [K, V]> | null, limit?: number) {
    if (entries) {
      super(entries);
    } else {
      super();
    }

    if (limit) {
      this.limit = limit > 0 ? limit : null;
    }
  }

  /**
   * Whether the given argument is a Collection
   * @param {unknown} collection Data to check if collection
   * @returns {boolean}
   */
  public static isCollection<K, V>(collection: unknown): collection is Collection<K, V> {
    return collection instanceof Collection;
  }

  /**
   * Maps the {@link Collection} values into an array
   * @type {V[]}
   */
  public get toArray(): V[] {
    return [...this.values()];
  }

  /**
   * Maps the {@link Collection} keys into an array
   * @type {K[]}
   */
  public get toArrayKeys(): K[] {
    return [...this.keys()];
  }

  /**
   * Maps the {@link Collection} entries an array
   * @type {[K, V][]}
   */
  public get toArrayEntries(): [K, V][] {
    return [...this.entries()];
  }

  /**
   * Creates a new Collection with all elements that pass the test implemented by the provided callback.
   * Identical to {@link Array.prototype.filter}
   * @param {function(value: V, key: K, collection: this): boolean} cb Callback function. Return true to keep the element, false otherwise
   * @returns {Collection<K, T>}
   * @template T - the type of the returned collection's values
   */
  public filter<T>(cb: (value: V, key?: K, collection?: this) => boolean): Collection<K, T> {
    const collection = new Collection<K, T>();

    for (const [key, value] of this) {
      if (cb(value, key, this)) {
        collection.set(key, (value as unknown) as T);
      }
    }

    return collection;
  }

  /**
   * Get the first value in the {@link Collection}
   * @type {V | undefined}
   */
  public get first(): V | undefined {
    if (!this.size) return undefined;

    return this.values().next().value;
  }

  /**
   * Get he first key in the {@link Collection}
   * @returns {K}
   */
  public get firstKey(): K | undefined {
    if (!this.size) return undefined;

    return this.keys().next().value;
  }

  /**
   * Get the last value in the {@link Collection}
   * @type {V}
   */
  public get last(): V | undefined {
    if (!this.size) return undefined;

    return this.toArray[this.size - 1];
  }

  /**
   * Get he last key in the {@link Collection}
   * @returns {K}
   */
  public get lastKey(): K | undefined {
    if (!this.size) return undefined;

    return this.toArrayKeys[this.size - 1];
  }

  /**
   * Returns the item if exists or creates a new one and caches it.
   * @param {K} key The key of the item
   * @param {V} value The value of the item
   * @returns {V}
   */
  public getOrSet(key: K, value: V): V {
    if (this.has(key)) {
      return this.get(key)!;
    } else {
      this.set(key, value);
      return value;
    }
  }

  /**
   * ֛Merges collection(s) on top of this one. Replaces existing keys by newer Collections
   * @param {...(Collection<K, V> | [K, V][])[]} collections The collection(s) to be merged on top of this one
   */
  public merge(...collections: (Collection<K, V> | [K, V][])[]): void {
    for (const collection of collections) {
      for (const [key, value] of collection) {
        this.set(key, value);
      }
    }
  }

  /**
   * Create a new Collection populated with the results of calling a provided callback on every element in the calling Collection.
   * Identical to {@link Array.prototype.map}
   * @param {function(value: V, key: K, collection: this): R} cb Callback function. The returned value is added to the new Collection
   * @returns {Collection<K, V>}
   * @template K, V
   * @template R - is the type of the values the new Collection will contain
   */
  public map<R>(cb: (value: V, key: K, collection: this) => R): Collection<K, R> {
    const collection = new Collection<K, R>();

    for (const [key, value] of this) {
      collection.set(key, cb(value, key, this));
    }

    return collection;
  }

  /**
   * Checks if the Collection has reached its limit and sets the item using {@link Map.prototype.set}
   * @param {K} key The key to set
   * @param {V} value The value to set
   * @param {boolean} force Whether to add the item to the Collection if its limit was reached
   * @returns {this}
   */
  public set(key: K, value: V, force?: boolean): this {
    // If the key already exists, a new item won't be added, thus keeping the size at the limit
    if (!force && this.limit && this.limit <= this.size && !this.has(key)) {
      if (this.firstKey) {
        this.delete(this.firstKey);
      }
    }

    return super.set(key, value);
  }

  /**
   * Returns the matching values for the given keys inside the Collection.
   * @param {K[]} keys Array of all keys to look for
   * @returns {V[]}
   */
  public getMany(keys: K[]): (V | undefined)[] {
    const values: (V | undefined)[] = [];

    for (const key of keys) {
      values.push(this.get(key));
    }

    return values;
  }

  /**
   * Removes the last item from the Collection and returns that item
   * Equivalent to Array#pop() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
   * @returns {[K, V] | undefined}
   */
  public pop(): [K, V] | undefined {
    if (!this.lastKey || !this.last) return;

    const popped: [K, V] = [this.lastKey, this.last];

    this.delete(this.lastKey);

    return popped;
  }

  /**
   * Removes the first item from a Collection and returns that removed item
   * Equivalent to Array#shift() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
   * @returns {[K, V] | undefined}
   */
  public shift(): [K, V] | undefined {
    if (!this.first || !this.firstKey) return;

    const shifted: [K, V] = [this.firstKey, this.first];

    this.delete(this.firstKey);

    return shifted;
  }

  /**
   * Tests whether all items in the Collection pass the test implemented by the provided function
   * Equivalent to Array#every() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
   * @param {function(value: V, key: K, collection: this): boolean} cb A function to test for each element
   * @returns {boolean}
   */
  public every(cb: (value: V, key: K, collection: this) => boolean): boolean {
    let flag = true;

    for (const [key, value] of this) {
      const result = cb(value, key, this);
      if (!result) {
        flag = false;
        break;
      }
    }

    return flag;
  }

  /**
   * Tests whether at least one element in the array passes the test implemented by the provided function
   * Equivalent to Array#some() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
   * @param {function(value: V, key: K, collection: this): boolean} cb A function to test for each element
   * @returns {boolean}
   */
  public some(cb: (value: V, key: K, collection: this) => boolean): boolean {
    let flag = false;

    for (const [key, value] of this) {
      const result = cb(value, key, this);
      if (result) {
        flag = true;
        break;
      }
    }

    return flag;
  }

  /**
   * Returns the value of the item in this collection that satisfies the provided testing callback function
   * Equivalent to Array#find() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
   * @param {function(value: V, key: K, collection: this): boolean} cb A function to test for each element
   * @returns {V | undefined}
   */
  public find(cb: (value: V, key: K, collection: this) => boolean): V | undefined {
    let item: V | undefined;

    for (const [key, value] of this) {
      const result = cb(value, key, this);
      if (result) {
        item = value;
        break;
      }
    }

    return item;
  }

  /**
   * @ignore
   * @returns {Serializable}
   */
  public toJSON(): V[] {
    return this.toArray;
  }
}

export default Collection;
