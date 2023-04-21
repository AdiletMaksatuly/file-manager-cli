// @params: args - array of arguments passed to the process

export const parseUsername = (args) => {
    return args.slice(2).reduce((prev, current) => {
        if (current.includes('--username')) {
            const [, value] = current.split('=');
            return value;
        }

        return '';
    }, '');
}