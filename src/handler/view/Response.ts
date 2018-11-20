export abstract class Response {
    public message: string;
    public statusCode: number;

    protected constructor(message: string, statusCode: number) {
        this.message = message;
        this.statusCode = statusCode;
    }

    public setResponse(message: string, statusCode: number = 200) {
        this.message = this.formatResponseMessage(message);
        this.statusCode = statusCode;
    }

    protected abstract formatResponseMessage(message: string): string;
}


export class ApiResponse extends Response {
    constructor(message: string = '', statusCode: number = 200) {
        super(message, statusCode);
    }

    public setResponse(message: string, statusCode: number = 200) {
        this.message = this.formatResponseMessage(message);
        this.statusCode = statusCode;
    }

    protected formatResponseMessage(message:string): string {
        return message;
    }
}

export class SlackResponse extends Response {
    constructor(message: string = '', statusCode: number = 200) {
        super(message, statusCode);
    }

    public setResponse(message: string, statusCode: number = 200) {
        console.log(message);
        this.message = this.formatResponseMessage(message);
        this.statusCode = statusCode;
    }

    protected formatResponseMessage(message:string): string {
        return message.replace(/"/g,"*");
    }
}


