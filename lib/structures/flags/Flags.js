"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flags = void 0;
/**
 * Manager class responsible for retrieving data off of bit-wise flags
 * @template T
 */
class Flags {
    constructor(flags) {
        this.flags = flags;
    }
    /**
     * Whether a specific flag is included in this instance's flags
     * @param {T} flag The flag to check if included
     * @returns {boolean}
     */
    has(flag) {
        return (this.flags & flag) === flag;
    }
    /**
     * Returns the bits of the flags this instance contains
     * @type {number}
     */
    get bits() {
        return this.flags;
    }
    /**
     * Creates a new instance of {@link Flags} based on given flags
     * @param {T[]} flags An array of all flags the {@link Flags} instance should contain
     * @returns {Flags<T>}
     */
    static from(...flags) {
        const bits = flags.reduce((totalBits, bit) => totalBits | bit, 0);
        return new Flags(bits);
    }
}
exports.Flags = Flags;
