"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    stringify() {
        return __awaiter(this, void 0, void 0, function* () {
            const { image, mime } = this;
            if (!mime) {
                throw new Error(`Invalid mime type for image ${this.path}`);
            }
            return `data:${mime};base64,${yield image}`;
        });
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
