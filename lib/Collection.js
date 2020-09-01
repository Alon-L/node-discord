"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Collections serve as data holders throughout the library.
 * They are a combination of JavaScript Maps and Arrays with the
 * ability to hold large amount of data.
 * @template K, V
 */
class Collection extends Map {
    constructor(entries, limit) {
        if (entries) {
            super(entries);
        }
        else {
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
    static isCollection(collection) {
        return collection instanceof Collection;
    }
    /**
     * Maps the {@link Collection} values into an array
     * @type {V[]}
     */
    get toArray() {
        return [...this.values()];
    }
    /**
     * Maps the {@link Collection} keys into an array
     * @type {K[]}
     */
    get toArrayKeys() {
        return [...this.keys()];
    }
    /**
     * Maps the {@link Collection} entries an array
     * @type {[K, V][]}
     */
    get toArrayEntries() {
        return [...this.entries()];
    }
    /**
     * Creates a new Collection with all elements that pass the test implemented by the provided callback.
     * Identical to {@link Array.prototype.filter}
     * @param {function(value: V, key: K, collection: this): boolean} cb Callback function. Return true to keep the element, false otherwise
     * @returns {Collection<K, V>}
     */
    filter(cb) {
        const collection = new Collection();
        for (const [key, value] of this) {
            if (cb(value, key, this)) {
                collection.set(key, value);
            }
        }
        return collection;
    }
    /**
     * Get the first value in the {@link Collection}
     * @type {V | undefined}
     */
    get first() {
        if (!this.size)
            return undefined;
        return this.values().next().value;
    }
    /**
     * Get he first key in the {@link Collection}
     * @returns {K}
     */
    get firstKey() {
        if (!this.size)
            return undefined;
        return this.keys().next().value;
    }
    /**
     * Get the last value in the {@link Collection}
     * @type {V}
     */
    get last() {
        if (!this.size)
            return undefined;
        return this.toArray[this.size - 1];
    }
    /**
     * Get he last key in the {@link Collection}
     * @returns {K}
     */
    get lastKey() {
        if (!this.size)
            return undefined;
        return this.toArrayKeys[this.size - 1];
    }
    /**
     * Returns the item if exists or creates a new one and caches it.
     * @param {K} key The key of the item
     * @param {V} value The value of the item
     * @returns {V}
     */
    getOrSet(key, value) {
        if (this.has(key)) {
            return this.get(key);
        }
        else {
            this.set(key, value);
            return value;
        }
    }
    /**
     * ֛Merges collection(s) on top of this one. Replaces existing keys by newer Collections
     * @param {...(Collection<K, V> | [K, V][])[]} collections The collection(s) to be merged on top of this one
     */
    merge(...collections) {
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
    map(cb) {
        const collection = new Collection();
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
    set(key, value, force) {
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
    getMany(keys) {
        const values = [];
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
    pop() {
        if (!this.lastKey || !this.last)
            return;
        const popped = [this.lastKey, this.last];
        this.delete(this.lastKey);
        return popped;
    }
    /**
     * Removes the first item from a Collection and returns that removed item
     * Equivalent to Array#shift() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
     * @returns {[K, V] | undefined}
     */
    shift() {
        if (!this.first || !this.firstKey)
            return;
        const shifted = [this.firstKey, this.first];
        this.delete(this.firstKey);
        return shifted;
    }
    /**
     * Tests whether all items in the Collection pass the test implemented by the provided function
     * Equivalent to Array#every() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
     * @param {function(value: V, key: K, collection: this): boolean} cb A function to test for each element
     * @returns {boolean}
     */
    every(cb) {
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
    some(cb) {
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
    find(cb) {
        let item;
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
    toJSON() {
        return this.toArray;
    }
}
exports.default = Collection;
