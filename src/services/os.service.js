import os from 'os';
import {CLI_COMMANDS, CLI_OS_COMMANDS} from "../consts/commands.const.js";

export class OsService {
    constructor(dirMethods) {
    }

    processCommand(command, onErrorCb) {
        switch (command) {
            case CLI_OS_COMMANDS.EOL:
                return this.getEOL();
            case CLI_OS_COMMANDS.CPUS:
                return this.getCPUs();
            case CLI_OS_COMMANDS.HOMEDIR:
                return this.getHomeDir();
            case CLI_OS_COMMANDS.SYS_USER:
                return this.getSysUser();
            case CLI_OS_COMMANDS.ARCH:
                return this.getArchitecture();
            default:
                onErrorCb();
                break;
        }
    }

    getEOL() {
        process.stdout.write('EOL: ')
        return os.EOL;
    }

    getCPUs() {
        return 'getCPUs';
    }

    getHomeDir() {
        return 'getHomeDir';
    }

    getSysUser() {
        return 'getSysUser';
    }

    getArchitecture() {
        return 'getArchitecture';
    }
}