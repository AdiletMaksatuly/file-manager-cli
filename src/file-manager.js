import MessageService from "./message.service.js";
import {CLI_COMMANDS} from "./consts/commands.const.js";
import {OsService} from "./os.service.js";
import {HashService} from "./hash.service.js";
import {FileService} from "./file.service.js";
import {CompressionService} from "./compression.service.js";
import {NavigationService} from "./navigation.service.js";
import ParseService from "./parse.service.js";

class FileManager {
    parseService = new ParseService();
    messageService = new MessageService(this.parseService.parseUsername(process.argv));
    navigationService = new NavigationService();
    fileService = new FileService();
    hashService = new HashService();
    osService = new OsService();
    compressionService = new CompressionService();

    constructor() {
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

        process.on('SIGINT', this.onExitHandler);

        process.stdin.on('close', this.onExitHandler);
    }

    printUserGreeting = () => {
        this.print(this.messageService.getGreetingMessage());
    }
    printCurrentDir = () => {
        const message = `You are currently in ${this.navigationService.currentDir}`
        this.print(message);
    }

    getExitMessage = () => {
        return this.messageService.getExitMessage();
    }

    getErrorMessage = () => {
        return this.messageService.getErrorMessage();
    }

    onExitHandler = async () => {
        const command = CLI_COMMANDS.EXIT;
        const output = await this.processCommand(command);

        this.print(output)
        process.exit(0)
    }

    print = (message) => {
        process.stdout.write(message + '\n');
    }

    async processCommand(commandWithArgs) {
        const { command, args } = this.parseService.parseCommand(commandWithArgs);

        switch (command) {
            case CLI_COMMANDS.UP:
                return this.navigationService.goUpper();
            case CLI_COMMANDS.LIST:
                return this.navigationService.listFiles();
            case CLI_COMMANDS.CHANGE_DIR:
                const pathToDest = args.join('');

                return this.navigationService.changeDirectory(pathToDest);
            case CLI_COMMANDS.READ:
                return this.fileService.readFile();
            case CLI_COMMANDS.CREATE:
                return this.fileService.createFile();
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
                return this.getExitMessage();
            default:
                return this.getErrorMessage();
        }
    }
}

export default FileManager;