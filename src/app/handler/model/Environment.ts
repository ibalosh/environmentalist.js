import {User} from "./User";
import {EnvironmentFreeError, EnvironmentAlreadyTakenError} from "..";

/**
 * Environments model.
 */
export class Environment {
    public name: string;
    public taken: boolean;
    public takenAt: Date | null;
    public takenBy: User;

    constructor(name: string, taken: boolean = false, takenAt: Date|null = null, user: User = new User()) {
        this.name = name;
        this.taken = taken;
        this.takenAt = takenAt;
        this.takenBy = user;
    }

    public take(user: User, takeByForce: boolean): void {
        if (this.taken === false || takeByForce === true) {
            this.taken = true;
            this.takenAt = new Date();
            this.takenBy = user;
        }
        else {
            if (this.takenBy.id !== user.id) {
                throw new EnvironmentAlreadyTakenError(`Environment "${this.name}" is already taken.`)
            }
        }
    }

    public free(user: User, freeByFoce: boolean = false): void {
        if (this.taken === false || this.takenBy.username === user.username || freeByFoce === true) {
            this.clear();
        }
        else {
            throw new EnvironmentFreeError(`Environment "${this.name}" can only be freed by ${this.takenBy.username}.`)
        }
    }

    private clear() {
        this.taken = false;
        this.takenAt = null;
        this.takenBy = new User();
    }
}

