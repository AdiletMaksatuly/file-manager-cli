import os from 'os';
import {CLI_OS_COMMANDS} from "../consts/commands.const.js";

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
                return onErrorCb();
        }
    }

    getEOL() {
        return JSON.stringify(os.EOL);
    }

    getCPUs() {
        const cpus = os.cpus();

        return cpus.reduce((acc, cpu) => {
            acc.push({
                model: cpu.model,
                GHz: (cpu.speed / 1000).toFixed(2)
            });
            return acc;
        }, []);
    }

    getHomeDir() {
        return os.homedir();
    }

    getSysUser() {
        return os.userInfo().username;
    }

    getArchitecture() {
        return os.arch();
    }
}