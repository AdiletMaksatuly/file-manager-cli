class MessageService {
    username = '';

    constructor(username = 'User') {
        this.username = username;
    }

    getGreetingMessage() {
        return `Welcome to the File Manager, ${this.username}!\n`;
    }

    getExitMessage() {
        return `Thank you for using File Manager, ${this.username}, goodbye!`;
    }
}

export default MessageService;