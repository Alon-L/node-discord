/**
 * Clusters serve as data holders throughout the library.
 * They are a combination of JavaScript Maps and Arrays with the
 * ability to hold large amount of data.
 * @template K, V
 */
class Cluster<K, V> extends Map<K, V> {
  /**
   * The maximum number of items allowed in this Cluster
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
   * Whether the given argument is a cluster
   * @param {*} cluster Data to check if cluster
   * @returns {boolean}
   */
  public static isCluster(cluster: unknown): boolean {
    return cluster instanceof Cluster;
  }

  /**
   * Maps the {@link Cluster} values into an array
   * @type {V[]}
   */
  public get toArray(): V[] {
    return [...this.values()];
  }

  /**
   * Maps the {@link Cluster} keys into an array
   * @type {K[]}
   */
  public get toArrayKeys(): K[] {
    return [...this.keys()];
  }

  /**
   * Maps the {@link Cluster} entries an array
   * @type {[K, V][]}
   */
  public get toArrayEntries(): [K, V][] {
    return [...this.entries()];
  }

  /**
   * Creates a new Cluster with all elements that pass the test implemented by the provided callback.
   * Identical to {@link Array.prototype.filter}
   * @param {function(value: V, key: K, cluster: this): boolean} cb Callback function. Return true to keep the element, false otherwise
   * @returns {Cluster<K, T>}
   * @template T - the type of the returned cluster's values
   */
  public filter<T>(cb: (value: V, key?: K, cluster?: this) => boolean): Cluster<K, T> {
    const cluster = new Cluster<K, T>();

    for (const [key, value] of this) {
      if (cb(value, key, this)) {
        cluster.set(key, (value as unknown) as T);
      }
    }

    return cluster;
  }

  /**
   * Get the first value in the {@link Cluster}
   * @type {V | undefined}
   */
  public get first(): V | undefined {
    if (!this.size) return undefined;

    return this.values().next().value;
  }

  /**
   * Get he first key in the {@link Cluster}
   * @returns {K}
   */
  public get firstKey(): K | undefined {
    if (!this.size) return undefined;

    return this.keys().next().value;
  }

  /**
   * Get the last value in the {@link Cluster}
   * @type {V}
   */
  public get last(): V | undefined {
    if (!this.size) return undefined;

    return this.toArray[this.size - 1];
  }

  /**
   * Get he last key in the {@link Cluster}
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
   * ֛Merges cluster(s) on top of this one. Replaces existing keys by newer Clusters
   * @param {...(Cluster<K, V> | [K, V][])[]} clusters The cluster(s) to be merged on top of this one
   */
  public merge(...clusters: (Cluster<K, V> | [K, V][])[]): void {
    for (const cluster of clusters) {
      for (const [key, value] of cluster) {
        this.set(key, value);
      }
    }
  }

  /**
   * Create a new Cluster populated with the results of calling a provided callback on every element in the calling Cluster.
   * Identical to {@link Array.prototype.map}
   * @param {function(value: V, key: K, cluster: this): R} cb Callback function. The returned value is added to the new Cluster
   * @returns {Cluster<K, V>}
   * @template K, V
   * @template R - is the type of the values the new Cluster will contain
   */
  public map<R>(cb: (value: V, key: K, cluster: this) => R): Cluster<K, R> {
    const cluster = new Cluster<K, R>();

    for (const [key, value] of this) {
      cluster.set(key, cb(value, key, this));
    }

    return cluster;
  }

  /**
   * Checks if the Cluster has reached its limit and sets the item using {@link Map.prototype.set}
   * @param {K} key The key to set
   * @param {V} value The value to set
   * @param {boolean} force Whether to add the item to the Cluster if its limit was reached
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
   * Returns the matching values for the given keys inside the Cluster.
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
   * Removes the last item from the Cluster and returns that item
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
   * Removes the first item from a Cluster and returns that removed item
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
   * Tests whether all items in the Cluster pass the test implemented by the provided function
   * Equivalent to Array#every() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
   * @param {function(value: V, key: K, cluster: this): boolean} cb A function to test for each element
   * @returns {boolean}
   */
  public every(cb: (value: V, key: K, cluster: this) => boolean): boolean {
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
   * @param {function(value: V, key: K, cluster: this): boolean} cb A function to test for each element
   * @returns {boolean}
   */
  public some(cb: (value: V, key: K, cluster: this) => boolean): boolean {
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
   * @ignore
   * @returns {Serializable}
   */
  public toJSON(): V[] {
    return this.toArray;
  }
}

export default Cluster;
