import {User} from "./User";

/**
 * Note model.
 */
export class EnvironmentHealth {
    public healthy: boolean;
    public note: string | null;

    public constructor() {
        this.healthy = true;
        this.note = null;
    }

    public update(healthy: boolean, note: string | null = null) {
        this.healthy = healthy;
        this.note = note;
    }

}

