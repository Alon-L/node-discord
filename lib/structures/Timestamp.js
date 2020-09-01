"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = void 0;
/**
 * Handles the conversion of timestamps received from the Discord API into UNIX timestamps
 */
class Timestamp {
    constructor(date) {
        if (typeof date === 'number') {
            this.date = new Date(date).toISOString();
        }
        else if (date instanceof Date) {
            this.date = date.toISOString();
        }
        else {
            this.date = date;
        }
    }
    /**
     * Returns the UNIX timestamp of this timestamp
     * @returns {number | undefined}
     */
    unix() {
        return this.date ? Date.parse(this.date) : undefined;
    }
    /**
     * Returns the ISO date of this timestamp
     * @returns {string | undefined}
     */
    get iso() {
        return this.date ? new Date(this.date).toISOString() : undefined;
    }
}
exports.Timestamp = Timestamp;
