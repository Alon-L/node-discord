"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIFile = void 0;
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * The type of the API file
 */
var APIFileType;
(function (APIFileType) {
    APIFileType[APIFileType["File"] = 0] = "File";
    APIFileType[APIFileType["URL"] = 1] = "URL";
})(APIFileType || (APIFileType = {}));
/**
 * Represents a file sent directly to the API
 */
class APIFile {
    constructor(file) {
        if (typeof file === 'string') {
            this.type = APIFileType.URL;
            this.path = file;
            this.name = file.substring(file.lastIndexOf('/') + 1);
        }
        else {
            this.type = APIFileType.File;
            this.path = file.path;
            this.name = file.name;
        }
    }
    /**
     * Reads the content of this file as a readable stream
     * @returns {Promise<Stream>}
     */
    async read() {
        if (this.type === APIFileType.File) {
            return fs_1.default.createReadStream(this.path);
        }
        else {
            const { body } = await node_fetch_1.default(this.path);
            return body;
        }
    }
}
exports.APIFile = APIFile;
