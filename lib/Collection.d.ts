/**
 * Collections serve as data holders throughout the library.
 * They are a combination of JavaScript Maps and Arrays with the
 * ability to hold large amount of data.
 * @template K, V
 */
declare class Collection<K, V> extends Map<K, V> {
    /**
     * The maximum number of items allowed in this Collection
     */
    readonly limit: number | null | undefined;
    constructor(entries?: Iterable<readonly [K, V]> | null, limit?: number);
    /**
     * Whether the given argument is a Collection
     * @param {unknown} collection Data to check if collection
     * @returns {boolean}
     */
    static isCollection<K, V>(collection: unknown): collection is Collection<K, V>;
    /**
     * Maps the {@link Collection} values into an array
     * @type {V[]}
     */
    get toArray(): V[];
    /**
     * Maps the {@link Collection} keys into an array
     * @type {K[]}
     */
    get toArrayKeys(): K[];
    /**
     * Maps the {@link Collection} entries an array
     * @type {[K, V][]}
     */
    get toArrayEntries(): [K, V][];
    /**
     * Creates a new Collection with all elements that pass the test implemented by the provided callback.
     * Identical to {@link Array.prototype.filter}
     * @param {function(value: V, key: K, collection: this): boolean} cb Callback function. Return true to keep the element, false otherwise
     * @returns {Collection<K, V>}
     */
    filter<T extends V = V>(cb: (value: V, key?: K, collection?: this) => boolean): Collection<K, T>;
    /**
     * Get the first value in the {@link Collection}
     * @type {V | undefined}
     */
    get first(): V | undefined;
    /**
     * Get he first key in the {@link Collection}
     * @returns {K}
     */
    get firstKey(): K | undefined;
    /**
     * Get the last value in the {@link Collection}
     * @type {V}
     */
    get last(): V | undefined;
    /**
     * Get he last key in the {@link Collection}
     * @returns {K}
     */
    get lastKey(): K | undefined;
    /**
     * Returns the item if exists or creates a new one and caches it.
     * @param {K} key The key of the item
     * @param {V} value The value of the item
     * @returns {V}
     */
    getOrSet(key: K, value: V): V;
    /**
     * ֛Merges collection(s) on top of this one. Replaces existing keys by newer Collections
     * @param {...(Collection<K, V> | [K, V][])[]} collections The collection(s) to be merged on top of this one
     */
    merge(...collections: (Collection<K, V> | [K, V][])[]): void;
    /**
     * Create a new Collection populated with the results of calling a provided callback on every element in the calling Collection.
     * Identical to {@link Array.prototype.map}
     * @param {function(value: V, key: K, collection: this): R} cb Callback function. The returned value is added to the new Collection
     * @returns {Collection<K, V>}
     * @template K, V
     * @template R - is the type of the values the new Collection will contain
     */
    map<R>(cb: (value: V, key: K, collection: this) => R): Collection<K, R>;
    /**
     * Checks if the Collection has reached its limit and sets the item using {@link Map.prototype.set}
     * @param {K} key The key to set
     * @param {V} value The value to set
     * @param {boolean} force Whether to add the item to the Collection if its limit was reached
     * @returns {this}
     */
    set(key: K, value: V, force?: boolean): this;
    /**
     * Returns the matching values for the given keys inside the Collection.
     * @param {K[]} keys Array of all keys to look for
     * @returns {V[]}
     */
    getMany(keys: K[]): (V | undefined)[];
    /**
     * Removes the last item from the Collection and returns that item
     * Equivalent to Array#pop() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
     * @returns {[K, V] | undefined}
     */
    pop(): [K, V] | undefined;
    /**
     * Removes the first item from a Collection and returns that removed item
     * Equivalent to Array#shift() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
     * @returns {[K, V] | undefined}
     */
    shift(): [K, V] | undefined;
    /**
     * Tests whether all items in the Collection pass the test implemented by the provided function
     * Equivalent to Array#every() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
     * @param {function(value: V, key: K, collection: this): boolean} cb A function to test for each element
     * @returns {boolean}
     */
    every(cb: (value: V, key: K, collection: this) => boolean): boolean;
    /**
     * Tests whether at least one element in the array passes the test implemented by the provided function
     * Equivalent to Array#some() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     * @param {function(value: V, key: K, collection: this): boolean} cb A function to test for each element
     * @returns {boolean}
     */
    some(cb: (value: V, key: K, collection: this) => boolean): boolean;
    /**
     * Returns the value of the item in this collection that satisfies the provided testing callback function
     * Equivalent to Array#find() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
     * @param {function(value: V, key: K, collection: this): boolean} cb A function to test for each element
     * @returns {V | undefined}
     */
    find(cb: (value: V, key: K, collection: this) => boolean): V | undefined;
    /**
     * @ignore
     * @returns {Serializable}
     */
    toJSON(): V[];
}
export default Collection;
