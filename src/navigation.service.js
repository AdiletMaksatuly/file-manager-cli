import os from "os";
import fsPromises from "fs/promises";
import {sortStringAlphabetically} from "./utils/alphabet-sort.util.js";
import path from 'path';

export class NavigationService {
    currentDir = os.homedir();
    constructor() {
    }
    goUpper() {
        return 'goUpper';
    }
    async changeDirectory(pathToDest) {
        const normalizedPath = path.normalize(pathToDest);
        const absolutePath = path.resolve(this.currentDir, normalizedPath);

        try {
            await fsPromises.access(absolutePath)

            this.currentDir = absolutePath;
        } catch (error) {
            throw new Error('Directory does not exist');
        }
    }
    async listFiles() {
        const files = await fsPromises.readdir(this.currentDir, { withFileTypes: true });

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