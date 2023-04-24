import zlib from 'zlib';
import path from "path";
import fsPromises from "fs/promises";
import {ERROR_MESSAGES} from "../consts/errors.const.js";
import fs from "fs";

export class CompressionService {
    getCurrentDir;
    setCurrentDir;

    constructor(dirMethods) {
        if (!dirMethods) {
            throw new Error('CompressionService requires dirMethods object with getCurrentDir and setCurrentDir methods');
        }

        this.getCurrentDir = dirMethods.getCurrentDir;
        this.setCurrentDir = dirMethods.setCurrentDir;
    }

    async compress(srcPath, destPath) {
        const currentDir = this.getCurrentDir();

        const normalizedSrcPath = path.normalize(srcPath);
        const absoluteSrcPath = path.resolve(currentDir, normalizedSrcPath);

        const normalizedDestPath = path.normalize(destPath);
        const absoluteDestPath = path.resolve(currentDir, normalizedDestPath, path.basename(absoluteSrcPath) + '.br');

        try {
            const absoluteDestDir = path.dirname(absoluteDestPath);

            await fsPromises.access(absoluteSrcPath);
            await fsPromises.access(absoluteDestDir);
        } catch (error) {
            return ERROR_MESSAGES.INVALID_INPUT;
        }

        try {
            const source = fs.createReadStream(absoluteSrcPath);
            const target = fs.createWriteStream(absoluteDestPath);

            const brotliCompress = zlib.createBrotliCompress();

            source.pipe(brotliCompress).pipe(target);
        } catch (error) {
            return ERROR_MESSAGES.OPERATION_FAILED;
        }
    }

    decompress() {
        return 'decompress';
    }
}