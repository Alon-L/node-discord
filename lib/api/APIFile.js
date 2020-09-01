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
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.type === APIFileType.File) {
                return fs_1.default.createReadStream(this.path);
            }
            else {
                const { body } = yield node_fetch_1.default(this.path);
                return body;
            }
        });
    }
}
exports.APIFile = APIFile;
