import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import {ERROR_MESSAGES} from "../consts/errors.const.js";

export class FileService {
    getCurrentDir;
    setCurrentDir;

    constructor(dirMethods) {
        if (!dirMethods) {
            throw new Error('FileService requires dirMethods object with getCurrentDir and setCurrentDir methods');
        }

        this.getCurrentDir = dirMethods.getCurrentDir;
        this.setCurrentDir = dirMethods.setCurrentDir;
    }

    async readFile(pathToFile) {
        const currentDir = this.getCurrentDir();

        const normalizedPath = path.normalize(pathToFile);
        const absolutePath = path.resolve(currentDir, normalizedPath);

        try {
            await fsPromises.access(absolutePath);
        } catch (error) {
            return ERROR_MESSAGES.INVALID_INPUT;
        }

        try {
            const fileContent = new Promise((resolve, reject) => {
                const stream = fs.createReadStream(absolutePath);

                let content = '';

                stream.on("data", (data) => content += data.toString());
                stream.on('error', () => reject(ERROR_MESSAGES.OPERATION_FAILED));
                stream.on('end', () => resolve(content));
            });

            return await fileContent;
        } catch (error) {
            return error;
        }
    }

    async createFile(fileName) {
        const currentDir = this.getCurrentDir();

        const normalizedPath = path.normalize(fileName);
        const absolutePath = path.resolve(currentDir, normalizedPath);

        try {
            await fsPromises.writeFile(absolutePath, '');
        } catch (error) {
            return ERROR_MESSAGES.OPERATION_FAILED;
        }
    }

    async renameFile(oldPath, newPath) {
        const currentDir = this.getCurrentDir();

        const normalizedSrcPath = path.normalize(oldPath);
        const absoluteSrcPath = path.resolve(currentDir, normalizedSrcPath);

        const normalizedDestPath = path.normalize(newPath);
        const absoluteDestPath = path.resolve(currentDir, normalizedDestPath);

        try {
            const destPathSplit = path.resolve(currentDir, path.normalize(newPath)).split('/');
            const newPathIsJustFileName = destPathSplit.length === 1;

            if (!newPathIsJustFileName) {
                // if newPath is not just a file name, we need to check if the directory exists of newFileName exists
                // for example rn desktop/file.txt desktop/newFolder/file2.txt

                const destPathWithoutFileName = destPathSplit.slice(0, -1).join('/');
                await fsPromises.access(destPathWithoutFileName);
            }

            await fsPromises.access(absoluteSrcPath);
        } catch (error) {
            return ERROR_MESSAGES.INVALID_INPUT;
        }

        try {
            return await fsPromises.rename(absoluteSrcPath, absoluteDestPath);
        } catch (error) {
            return ERROR_MESSAGES.OPERATION_FAILED;
        }
    }

    async copyFile(sourceFilePath, destFileDir) {
        const currentDir = this.getCurrentDir();

        const normalizedSrcPath = path.normalize(sourceFilePath);
        const absoluteSrcPath = path.resolve(currentDir, normalizedSrcPath);

        const normalizedDestPath = path.normalize(destFileDir);
        let absoluteDestPath = path.resolve(currentDir, normalizedDestPath);

        const isSameDirectory = path.dirname(absoluteSrcPath) === absoluteDestPath;
        if (isSameDirectory) {
            const copiedFileName = normalizedDestPath + '/' + path.parse(absoluteSrcPath).name + '.copy' + path.extname(absoluteSrcPath);

            absoluteDestPath = path.resolve(currentDir, copiedFileName);
        } else {
            absoluteDestPath = path.resolve(currentDir, normalizedDestPath, path.basename(absoluteSrcPath));
        }

        try {
            const absoluteDestPathDir = path.dirname(absoluteDestPath);

            await fsPromises.access(absoluteSrcPath);
            await fsPromises.access(absoluteDestPathDir);
        } catch (error) {
            return ERROR_MESSAGES.INVALID_INPUT;
        }

        try {
            const copyFileProcess = new Promise((resolve, reject) => {
                const sourceReadableStream = fs.createReadStream(absoluteSrcPath);
                const destWritableStream = fs.createWriteStream(absoluteDestPath);

                sourceReadableStream.on('error', (error) => reject(error));
                destWritableStream.on('error', (error) => reject(error));
                destWritableStream.on('finish', () => resolve());

                sourceReadableStream.pipe(destWritableStream);
            });

            return await copyFileProcess;
        } catch (error) {
            return ERROR_MESSAGES.OPERATION_FAILED;
        }
    }

    async moveFile(sourceFilePath, destDir) {
        const currentDir = this.getCurrentDir();

        const normalizedSrcPath = path.normalize(sourceFilePath);
        const absoluteSrcPath = path.resolve(currentDir, normalizedSrcPath);

        const normalizedDestPath = path.normalize(destDir);
        const absoluteDestPath = path.resolve(currentDir, normalizedDestPath);

        try {
            const isDestDirCorrect = (await fsPromises.stat(absoluteDestPath)).isDirectory();

            if (!isDestDirCorrect) throw new Error('Destination is not a directory');

            await fsPromises.access(absoluteSrcPath);
            await fsPromises.access(absoluteDestPath);
        } catch (error) {
            return ERROR_MESSAGES.INVALID_INPUT;
        }

        try {
            const moveFileProcess = new Promise((resolve, reject) => {
                let absoluteDestPath = path.resolve(currentDir, normalizedDestPath, path.basename(absoluteSrcPath));

                const sourceReadableStream = fs.createReadStream(absoluteSrcPath);
                const destWritableStream = fs.createWriteStream(absoluteDestPath);

                sourceReadableStream.on('error', (error) => reject(error));
                destWritableStream.on('error', (error) => reject(error));
                destWritableStream.on('finish', async () => {
                    await fsPromises.unlink(absoluteSrcPath);

                    resolve();
                });

                sourceReadableStream.pipe(destWritableStream);
            });

            return await moveFileProcess;
        } catch (error) {
            return ERROR_MESSAGES.OPERATION_FAILED;
        }
    }

    deleteFile() {
        return 'deleteFile'
    }
}