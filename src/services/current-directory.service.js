import os from "os";

class CurrentDirectoryService {
    currentDir;

    constructor(currentDir) {
        this.currentDir = currentDir || os.homedir();
    }

    setCurrentDir(currentDir) {
        this.currentDir = currentDir;
    }

    getCurrentDir() {
        return this.currentDir;
    }
}

export default CurrentDirectoryService;