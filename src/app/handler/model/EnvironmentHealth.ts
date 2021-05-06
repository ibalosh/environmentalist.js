import {User} from "./User";
import {EnvironmentBrokenNoteMissingError} from "..";

/**
 * Note model.
 */
export class EnvironmentHealth {
    public healthy: boolean;
    public note: string | null;
    public updateBy: User;

    public constructor() {
        this.healthy = true;
        this.note = null;
        this.updateBy = new User();
    }

    public update(user: User, healthy: boolean, note: string | null = null) {
        if (healthy === false && (note === null || note === undefined || note.trim().length === 0)) {
            throw new EnvironmentBrokenNoteMissingError("Note has to be provided when reporting broken environment.");
        }
        else {
            this.updateBy = user;
            this.healthy = healthy;
            this.note = note;
        }
    }
}

