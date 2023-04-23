import MessageService from "./services/message.service.js";
import {CLI_COMMANDS} from "./consts/commands.const.js";
import {OsService} from "./services/os.service.js";
import {HashService} from "./services/hash.service.js";
import {FileService} from "./services/file.service.js";
import {CompressionService} from "./services/compression.service.js";
import {NavigationService} from "./services/navigation.service.js";
import ParseService from "./services/parse.service.js";
import CurrentDirectoryService from "./services/current-directory.service.js";

class FileManager {
    parseService = new ParseService();
    currentDirService = new CurrentDirectoryService();
    messageService;
    navigationService;
    fileService;
    hashService;
    osService;
    compressionService;

    constructor() {
        const username = this.parseService.parseUsername(process.argv);
        this.messageService = new MessageService(username);

        const currentDirMethods = {
            getCurrentDir: this.currentDirService.getCurrentDir.bind(this.currentDirService),
            setCurrentDir: this.currentDirService.setCurrentDir.bind(this.currentDirService),
        }

        this.navigationService = new NavigationService(currentDirMethods);
        this.fileService = new FileService(currentDirMethods);
        this.hashService = new HashService();
        this.osService = new OsService();
        this.compressionService = new CompressionService();

        this.setListeners();
        this.printUserGreeting();
        this.printCurrentDir();
    }

    setListeners() {
        process.stdin.on('data', async (data) => {
            const command = data.toString().trim();

            try {
                const output = await this.processCommand(command);

                let outputToPrint = output;

                // if something is returned from the command, print it
                if (outputToPrint && Array.isArray(output)) {
                    outputToPrint = output.join('\n');
                }

                if (outputToPrint) {
                    this.print(outputToPrint);
                }
            } catch (error) {
                const errorMessage = this.getErrorMessage() + ': ' + error.message;

                this.print(errorMessage);
            } finally {
                this.printCurrentDir();
            }
        });

        process.on('SIGINT', this.exitProcess);

        process.stdin.on('close', this.exitProcess);
    }

    printUserGreeting = () => {
        this.print(this.messageService.getGreetingMessage());
    }

    printCurrentDir = () => {
        const message = `You are currently in ${this.currentDirService.getCurrentDir()}`
        this.print(message);
    }

    getExitMessage = () => {
        return this.messageService.getExitMessage();
    }

    getErrorMessage = () => {
        return this.messageService.getErrorMessage();
    }

    exitProcess = () => {
        this.print(this.getExitMessage())
        process.exit(0);
    }

    print = (message) => {
        process.stdout.write(message + '\n');
    }

    async processCommand(commandWithArgs) {
        const { command, args } = this.parseService.parseCommand(commandWithArgs);
        const commandArgs = args.join(' ');

        switch (command) {
            case CLI_COMMANDS.UP:
                return this.navigationService.goUpper();
            case CLI_COMMANDS.LIST:
                return this.navigationService.listFiles();
            case CLI_COMMANDS.CHANGE_DIR:
                return this.navigationService.changeDirectory(commandArgs);
            case CLI_COMMANDS.READ:
                return this.fileService.readFile(commandArgs);
            case CLI_COMMANDS.CREATE:
                return this.fileService.createFile(commandArgs);
            case CLI_COMMANDS.RENAME:
                return this.fileService.renameFile();
            case CLI_COMMANDS.COPY:
                return this.fileService.copyFile();
            case CLI_COMMANDS.MOVE:
                return this.fileService.moveFile();
            case CLI_COMMANDS.DELETE:
                return this.fileService.deleteFile();
            case CLI_COMMANDS.EOL:
                return this.osService.getEOL();
            case CLI_COMMANDS.CPUS:
                return this.osService.getCPUs();
            case CLI_COMMANDS.HOMEDIR:
                return this.osService.getHomeDir();
            case CLI_COMMANDS.SYS_USER:
                return this.osService.getSysUser();
            case CLI_COMMANDS.ARCH:
                return this.osService.getArchitecture();
            case CLI_COMMANDS.HASH:
                return this.hashService.calculateHash();
            case CLI_COMMANDS.COMPRESS:
                return this.compressionService.compress();
            case CLI_COMMANDS.DECOMPRESS:
                return this.compressionService.decompress();
            case CLI_COMMANDS.EXIT:
                return this.exitProcess();
            default:
                return this.getErrorMessage();
        }
    }
}

export default FileManager;