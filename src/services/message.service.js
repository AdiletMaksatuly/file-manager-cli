import {ERROR_MESSAGES} from "../consts/errors.const.js";

class MessageService {
    username = '';


    constructor(username) {
        this.username = username || 'User';
    }

    getGreetingMessage() {
        return `Welcome to the File Manager, ${this.username}!`;
    }

    getExitMessage() {
        return `Thank you for using File Manager, ${this.username}, goodbye!`;
    }

    getErrorMessage() {
        return ERROR_MESSAGES.INVALID_INPUT;
    }
}

export default MessageService;