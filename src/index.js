import MessageService from "./message.service.js";
const getGreetingMessage = (username = 'User') => {
  return `Welcome to the File Manager, ${username}!\n`;
}

const parseUsername = (args) => {
    return args.slice(2).reduce((prev, current) => {
        if (current.includes('--username')) {
            const [, value] = current.split('=');
            return value;
        }

        return '';
    }, '');
}

const startFileManager = () => {
    const messageService = new MessageService(parseUsername(process.argv));

    process.stdout.write(messageService.getGreetingMessage());

    process.stdin.on('data', (data) => {

    });

    process.on('SIGINT', () => {
        process.stdout.write(messageService.getExitMessage());
        process.exit(0)
    });

    process.stdin.on('close', () => {
        process.exit(0);
    });
}

startFileManager();