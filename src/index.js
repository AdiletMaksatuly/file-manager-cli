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
    process.stdout.write(getGreetingMessage(parseUsername(process.argv)));

    process.stdin.on('data', (data) => {

    });
}

startFileManager();