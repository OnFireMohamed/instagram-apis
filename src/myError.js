module.exports = class myError extends Error {
    constructor (message) {
        super(message);
        this.message = message;
    }
}