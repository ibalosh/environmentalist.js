export class Response {
    public message: any;
    public statusCode: number;

    public constructor(message: any = null, statusCode: number = 200) {
        this.message = message;
        this.statusCode = statusCode;
    }

    public setResponse(message: any, statusCode: number = 200) {
        this.message = message;
        this.statusCode = statusCode;
    }
}