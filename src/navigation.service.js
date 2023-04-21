import os from "os";
import fsPromises from "fs/promises";
import {sortStringAlphabetically} from "./utils/alphabet-sort.util.js";

export class NavigationService {
    currentDir = os.homedir();

    constructor() {
    }
    goUpper() {
        return 'goUpper';
    }
    changeDirectory(path) {
        return 'changeDirectory';
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