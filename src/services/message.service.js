class MessageService {
    username = '';


    constructor(username = 'User') {
        this.username = username;
    }

    getGreetingMessage() {
        return `Welcome to the File Manager, ${this.username}!`;
    }

    getExitMessage() {
        return `Thank you for using File Manager, ${this.username}, goodbye!`;
    }

    getErrorMessage() {
        return 'Invalid input';
    }
}

export default MessageService;