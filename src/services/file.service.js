import fsPromises from "fs/promises";
import path from "path";
import fs from "fs";
import {ERROR_MESSAGES} from "../consts/errors.const.js";

export class FileService {
    getCurrentDir;
    setCurrentDir;

    constructor(dirMethods) {
        if (!dirMethods) {
            throw new Error('FileService requires dirMethods object with getCurrentDir and setCurrentDir methods');
        }

        this.getCurrentDir = dirMethods.getCurrentDir;
        this.setCurrentDir = dirMethods.setCurrentDir;
    }

    async readFile(pathToFile) {
        const currentDir = this.getCurrentDir();

        const normalizedPath = path.normalize(pathToFile);
        const absolutePath = path.resolve(currentDir, normalizedPath);

        try {
            await fsPromises.access(absolutePath);
        } catch (error) {
            return ERROR_MESSAGES.INVALID_INPUT;
        }

        try {
            const fileContent = new Promise((resolve, reject) => {
                const stream = fs.createReadStream(absolutePath);

                let content = '';

                stream.on("data", (data) => {
                    content += data.toString();
                });
                stream.on('error', (error) => {
                    reject(ERROR_MESSAGES.OPERATION_FAILED);
                });
                stream.on('end', () => {
                    resolve(content);
                });
            });

            return await fileContent;
        } catch (error) {
            return error;
        }
    }

    createFile() {
        return 'createFile'
    }

    renameFile() {
        return 'renameFile'
    }

    copyFile() {
        return 'copyFile'
    }

    moveFile() {
        return 'moveFile';
    }

    deleteFile() {
        return 'deleteFile'
    }
}