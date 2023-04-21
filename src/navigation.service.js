import os from "os";

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
    listFiles() {
        return 'listFiles';
    }
}