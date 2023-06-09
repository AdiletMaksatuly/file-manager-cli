import MessageService from "./services/message.service.js";
import {CLI_COMMANDS} from "./consts/commands.const.js";
import {OsService} from "./services/os.service.js";
import {HashService} from "./services/hash.service.js";
import {FileService} from "./services/file.service.js";
import {CompressionService} from "./services/compression.service.js";
import {NavigationService} from "./services/navigation.service.js";
import ParseService from "./services/parse.service.js";
import CurrentDirectoryService from "./services/current-directory.service.js";
import os from "os";

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
        this.hashService = new HashService(currentDirMethods);
        this.osService = new OsService();
        this.compressionService = new CompressionService(currentDirMethods);

        this.setListeners();
        this.printUserGreeting();
        this.printCurrentDir();
    }

    setListeners() {
        process.stdin.on('data', async (data) => {
            const command = data.toString().trim();

            try {
                // TODO think about making processCommand a child process or readable stream
                // TODO to be able to receive it's output by chunks if it's returning a results of streams
                const output = await this.processCommand(command);

                let outputToPrint = output;

                if (outputToPrint && Array.isArray(output) && typeof output[0] === 'string') {
                    outputToPrint = output.join(os.EOL);
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
        if (typeof message === 'string') {
            process.stdout.write(message + os.EOL);
            return;
        }

        console.table(message);
    }

    async processCommand(commandWithArgs) {
        const { command, args } = this.parseService.parseCommand(commandWithArgs);

        switch (command) {
            case CLI_COMMANDS.UP:
                return this.navigationService.goUpper();
            case CLI_COMMANDS.LIST:
                return this.navigationService.listFiles();
            case CLI_COMMANDS.CHANGE_DIR:
                const pathToDir = args.join('');

                return this.navigationService.changeDirectory(pathToDir);
            case CLI_COMMANDS.READ:
                const pathToFile = args.join('');

                return this.fileService.readFile(pathToFile);
            case CLI_COMMANDS.CREATE:
                const fileName = args.join('');

                return this.fileService.createFile(fileName);
            case CLI_COMMANDS.RENAME:
                const [oldPath, newPath] = args;

                return this.fileService.renameFile(oldPath, newPath);
            case CLI_COMMANDS.COPY:
                const [sourceFilePath, destFileDir] = args;

                return this.fileService.copyFile(sourceFilePath, destFileDir);
            case CLI_COMMANDS.MOVE:
                const [sourcePath, destPath] = args;

                return this.fileService.moveFile(sourcePath, destPath);
            case CLI_COMMANDS.DELETE:
                const [fileToDelete] = args;

                return this.fileService.deleteFile(fileToDelete);
            case CLI_COMMANDS.OS:
                const [osCommand] = args;
                return this.osService.processCommand(osCommand, () => this.getErrorMessage());
            case CLI_COMMANDS.HASH:
                const [srcFilePath] = args;

                return this.hashService.calculateHash(srcFilePath);
            case CLI_COMMANDS.COMPRESS:
                const [fileToCompress, destDir] = args;

                return this.compressionService.compress(fileToCompress, destDir);
            case CLI_COMMANDS.DECOMPRESS:
                const [fileToDecompress, destDirPath] = args;

                return this.compressionService.decompress(fileToDecompress, destDirPath);
            case CLI_COMMANDS.EXIT:
                return this.exitProcess();
            default:
                return this.getErrorMessage();
        }
    }
}

export default FileManager;