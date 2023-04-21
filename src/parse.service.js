export default class ParseService {
    parseUsername = (args) => {
        return args.slice(2).reduce((prev, current) => {
            if (current.includes('--username')) {
                const [, value] = current.split('=');
                return value;
            }

            return '';
        }, '');
    }

    parseCommand = (commandWithArgs) => {
        const [command, ...args] = commandWithArgs.split(' ');

        return {command, args};
    }
}