/**
 * Standard error on which all sub-errors of the app are based.
 **/
export class EnvironmentalistError extends Error {
    constructor(message: string) {
        super(message);

        // this is mandatory due:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, EnvironmentalistError.prototype);
        this.setUpStackTrace();
    }

    protected setUpStackTrace() {
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class EnvironmentBrokenNoteMissingError extends EnvironmentalistError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, EnvironmentBrokenNoteMissingError.prototype);
        this.setUpStackTrace();
    }
}

export class EnvironmentNotExistingError extends EnvironmentalistError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, EnvironmentNotExistingError.prototype);
        this.setUpStackTrace();
    }
}

export class EnvironmentAlreadyTakenError extends EnvironmentalistError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, EnvironmentAlreadyTakenError.prototype);
        this.setUpStackTrace();
    }
}

export class EnvironmentFreeError extends EnvironmentalistError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, EnvironmentFreeError.prototype);
        this.setUpStackTrace();
    }
}

export class EnvironmentRequestError extends EnvironmentalistError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, EnvironmentRequestError.prototype);
        this.setUpStackTrace();
    }
}