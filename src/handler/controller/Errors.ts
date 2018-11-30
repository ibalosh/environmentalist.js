/**
 * Standard error on which all sub-errors of the app are based.
 **/
export class HabitatError extends Error {
    constructor(message: string) {
        super(message);

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

export class EnvironmentNotExistingError extends HabitatError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, EnvironmentNotExistingError.prototype);
        this.setUpStackTrace();
    }
}

export class EnvironmentAlreadyTakenError extends HabitatError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, EnvironmentAlreadyTakenError.prototype);
        this.setUpStackTrace();
    }
}

export class EnvironmentFreeError extends HabitatError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, EnvironmentFreeError.prototype);
        this.setUpStackTrace();
    }
}