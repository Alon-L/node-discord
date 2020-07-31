/**
 * Manager class responsible for retrieving data off of bit-wise flags
 * @template T
 */
export class Flags<T extends number> {
  /**
   * Integer of the flags
   */
  protected readonly flags: number;

  constructor(flags: number) {
    this.flags = flags;
  }

  /**
   * Whether a specific flag is included in this instance's flags
   * @param {T} flag The flag to check if included
   * @returns {boolean}
   */
  public has(flag: T): boolean {
    return (this.flags & flag) === flag;
  }

  /**
   * Returns the bits of the flags this instance contains
   * @type {number}
   */
  public get bits(): number {
    return this.flags;
  }

  /**
   * Creates a new instance of {@link Flags} based on given flags
   * @param {T[]} flags An array of all flags the {@link Flags} instance should contain
   * @returns {Flags<T>}
   */
  public static build<T extends number>(...flags: T[]): Flags<T> {
    const bits = flags.reduce((totalBits: number, bit: number) => totalBits | bit, 0);

    return new Flags<T>(bits);
  }
}
