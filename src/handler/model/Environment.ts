import {User} from "./User";
import {EnvironmentFreeError, EnvironmentAlreadyTakenError} from "..";

export class Environment {
    public name: string;
    public taken: boolean;
    public takenAt: Date | null;
    public takenBy: User;

    constructor(name: string) {
        this.name = name;
        this.taken = false;
        this.takenAt = null;
        this.takenBy = new User();
    }

    public take(user: User, takeByForce: boolean): void {
        if (this.taken === false || takeByForce === true) {
            this.taken = true;
            this.takenAt = new Date();
            this.takenBy = user;
        }
        else {
            throw new EnvironmentAlreadyTakenError(`Environment "${this.name}" is already taken.`)
        }
    }

    public free(user: User): void {
        if (this.taken === false || this.takenBy.username === user.username) {
            this.taken = false;
            this.takenAt = null;
            this.takenBy = new User();
        }
        else {
            throw new EnvironmentFreeError(`Environment "${this.name}" can only be freed by ${this.takenBy.username}.`)
        }

    }
}

