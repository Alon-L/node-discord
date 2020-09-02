"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageURI = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const mime_types_1 = __importDefault(require("mime-types"));
const readFile = util_1.default.promisify(fs_1.default.readFile);
/**
 * Represents an image being sent to the Discord API as Image Data
 * https://discord.com/developers/docs/reference#image-data
 */
class ImageURI {
    /**
     * @param {string} path The image path
     * @example ```typescript
     * const image = new ImageURI('./image.png');
     * ```
     */
    constructor(path) {
        this.path = path;
    }
    /**
     * Returns the image mime and base64 data as a formatted string
     * @returns {string}
     */
    async stringify() {
        const { image, mime } = this;
        if (!mime) {
            throw new Error(`Invalid mime type for image ${this.path}`);
        }
        return `data:${mime};base64,${await image}`;
    }
    /**
     * Returns the image as base64
     * @type {string}
     */
    get image() {
        return readFile(this.path, { encoding: 'base64' });
    }
    /**
     * Returns the mime type of the image
     * @type {string | boolean}
     */
    get mime() {
        return mime_types_1.default.lookup(this.path);
    }
}
exports.ImageURI = ImageURI;
