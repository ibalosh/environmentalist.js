enum ErrorCodes {
    Default = 500,
    TakeEnvironmentError = 601,
    FreeEnvironmentError = 701
}

/**
 * Standard Habitat error on which all sub-errors are based.
 **/
export class HabitatError extends Error {
    public code: number;

    constructor(message: string, code: number = ErrorCodes.Default) {
        super(message);
        this.code = code;

        // this is mandatory due:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, HabitatError.prototype);
        this.setUpStackTrace();
    }

    protected setUpStackTrace() {
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class TakeEnvironmentError extends HabitatError {
    constructor(message: string) {
        super(message, ErrorCodes.TakeEnvironmentError);
        Object.setPrototypeOf(this, TakeEnvironmentError.prototype);
        this.setUpStackTrace();
    }
}

export class FreeEnvironmentError extends HabitatError {
    constructor(message: string) {
        super(message, ErrorCodes.FreeEnvironmentError);
        Object.setPrototypeOf(this, FreeEnvironmentError.prototype);
        this.setUpStackTrace();
    }
}