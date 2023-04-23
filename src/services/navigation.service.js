import os from "os";
import fsPromises from "fs/promises";
import {sortStringAlphabetically} from "../utils/alphabet-sort.util.js";
import path from 'path';
import {ERROR_MESSAGES} from "../consts/errors.const.js";

export class NavigationService {
    getCurrentDir;
    setCurrentDir;

    constructor(dirMethods) {
        if (!dirMethods) {
            throw new Error('NavigationService requires dirMethods object with getCurrentDir and setCurrentDir methods');
        }

        this.getCurrentDir = dirMethods.getCurrentDir;
        this.setCurrentDir = dirMethods.setCurrentDir;
    }
    goUpper() {
        const currentDir = this.getCurrentDir();

        if (currentDir === os.homedir()) return;

        this.setCurrentDir(path.resolve(currentDir, '..'));
    }
    async changeDirectory(pathToDest) {
        const currentDir = this.getCurrentDir();

        const normalizedPath = path.normalize(pathToDest);
        const absolutePath = path.resolve(currentDir, normalizedPath);

        try {
            await fsPromises.access(absolutePath)

            this.setCurrentDir(absolutePath);
        } catch (error) {
            return ERROR_MESSAGES.INVALID_INPUT;
        }
    }
    async listFiles() {
        const files = await fsPromises.readdir(this.getCurrentDir(), { withFileTypes: true });

        const normalizedFiles =
            [...files]
                .sort((fileA, fileB) => sortStringAlphabetically(fileA.name, fileB.name))
                .sort((fileA, fileB) => fileA.isFile() - fileB.isFile())
                .map(file => ({
                    Name: file.name,
                    Type: file.isFile() ? 'File' : 'Directory',
                }));

        console.table(normalizedFiles);
    }
}