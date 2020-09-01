/**
 * Manager class responsible for retrieving data off of bit-wise flags
 * @template T
 */
export declare class Flags<T extends number> {
    /**
     * Integer of the flags
     */
    protected readonly flags: number;
    constructor(flags: number);
    /**
     * Whether a specific flag is included in this instance's flags
     * @param {T} flag The flag to check if included
     * @returns {boolean}
     */
    has(flag: T): boolean;
    /**
     * Returns the bits of the flags this instance contains
     * @type {number}
     */
    get bits(): number;
    /**
     * Creates a new instance of {@link Flags} based on given flags
     * @param {T[]} flags An array of all flags the {@link Flags} instance should contain
     * @returns {Flags<T>}
     */
    static from<T extends number>(...flags: T[]): Flags<T>;
}
