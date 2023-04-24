import path from 'path';
import {createHash} from 'crypto'
import fsPromises, {readFile} from "fs/promises";
import {ERROR_MESSAGES} from "../consts/errors.const.js";

export class HashService {
    getCurrentDir;
    setCurrentDir;

    constructor(dirMethods) {
        if (!dirMethods) {
            throw new Error('HashService requires dirMethods object with getCurrentDir and setCurrentDir methods');
        }

        this.getCurrentDir = dirMethods.getCurrentDir;
        this.setCurrentDir = dirMethods.setCurrentDir;
    }

    async calculateHash(srcFilePath) {
        const targetFilePath = path.resolve(this.getCurrentDir(), path.normalize(srcFilePath));

        try {
            await fsPromises.access(targetFilePath);
        } catch (error) {
            return ERROR_MESSAGES.INVALID_INPUT;
        }

        try {
            const targetFileBuffer = await readFile(targetFilePath);

            return createHash("sha256").update(targetFileBuffer).digest("hex")
        } catch (error) {
            return ERROR_MESSAGES.OPERATION_FAILED;
        }
    }
}