import { LocalStorage } from "node-localstorage";
import {Environment} from "..";

/**
 * We want to preserve state when the server needs a reboot.
 * This class does a simple save/load of states to a file.
 */
class DataSaver {
    private localStorage: LocalStorage;
    private fileName: string = 'environments.json';

    constructor(path: string) {
        this.localStorage = new LocalStorage(path);
    }

    /**
     * Delete all preserved states.
     */
    public clearState() {
        this.localStorage.clear();
    }

    /**
     * Preserve environment states to a file.
     *
     * @param {Environment[]} environments - environments to save
     */
    public preserveState(environments: Environment[]) {
        try {
            let object: string = JSON.stringify(environments);
            this.localStorage.setItem(this.fileName, object);
        } catch (e) {
            // for now, only log errors to console
            console.log(e);
        }
    }

    /**
     * Retrieve environment states from a file.
     *
     * @returns {Environment[] | null} - environment states, if available.
     */
    public retrieveState():Environment[]|null {
        try {
            const data: string | null = this.localStorage.getItem(this.fileName);
            return (data !== null) ? this.populateEnvironments(data) : null;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    private populateEnvironments(data: string): Environment[] {
        const savedEnvironments: Environment[] = JSON.parse(data);
        const environments:Environment[] = [];

        savedEnvironments.forEach(env => {
            environments.push(new Environment(env.name, env.taken, env.takenAt, env.takenBy));
        });
        return environments;
    }
}

export default DataSaver;
