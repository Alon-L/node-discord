/**
 * Manager class responsible for retrieving data off of bit-wise flags
 * @template T
 */
class Flags<T extends number> {
  /**
   * Integer of the flags
   */
  private readonly flags: number;

  constructor(permissions: number) {
    this.flags = permissions;
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
}

export default Flags;
