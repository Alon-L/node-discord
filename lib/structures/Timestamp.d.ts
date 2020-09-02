/**
 * Handles the conversion of timestamps received from the Discord API into UNIX timestamps
 */
export declare class Timestamp {
    /**
     * The ISO date of this timestamp
     */
    date: string | undefined;
    constructor(date: string | number | Date | undefined);
    /**
     * Returns the UNIX timestamp of this timestamp
     * @returns {number | undefined}
     */
    unix(): number | undefined;
    /**
     * Returns the ISO date of this timestamp
     * @returns {string | undefined}
     */
    get iso(): string | undefined;
}
