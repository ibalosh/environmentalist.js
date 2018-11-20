export abstract class Response {
    public message: string;
    public statusCode: number;

    protected constructor(message: string, statusCode: number) {
        this.message = message;
        this.statusCode = statusCode;
    }

    public setResponse(message: string, statusCode: number = 200) {
        this.message = message;
        this.statusCode = statusCode;
    }
}


export class ApiResponse extends Response {
    constructor(message: string = '', statusCode: number = 200) {
        super(message, statusCode);
    }

    public setResponse(message: string, statusCode: number = 200) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

export class SlackResponse extends Response {
    constructor(message: string = '', statusCode: number = 200) {
        super(message, statusCode);
    }

    public setResponse(message: string, statusCode: number = 200) {
        this.message = message + 'slack. aaaa.';
        this.statusCode = statusCode;
    }
}


