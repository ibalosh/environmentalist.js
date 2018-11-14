export class Response {
    public message: string;
    public statusCode: number;

    constructor(message: string = '', statusCode: number = 200) {
        this.message = message;
        this.statusCode = statusCode;
    }

    public setResponse(message: string, statusCode: number = 200) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

export class SlackResponse extends Response {

}


