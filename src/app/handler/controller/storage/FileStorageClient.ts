import { LocalStorage } from "node-localstorage";
import {Environment} from "../../index";
import {StorageClient} from "./StorageClient";

/**
 * We want to preserve state when the server needs a reboot.
 * This class does a simple save/load of states to a file.
 */
export abstract class FileStorageClient extends StorageClient{
    constructor(path: string, fileName: string) {
        super();
        this.configuration = { fileName: fileName, path: path };
        this.client = new LocalStorage(path);
    }
}

export class EnvironmentalistFileClient extends FileStorageClient {
    public retrieveDeploymentStatusData(filter: any): any {
        throw Error('Not implemented.');
    }

    /**
     * Preserve environment states to a file.
     *
     * @param {Environment[]} environments - environments to save
     */
    public saveEnvironmentData(environments: Environment[]) {
        try {
            this.client.setItem(this.configuration.fileName, JSON.stringify(environments));
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
    public retrieveEnvironmentData():Environment[] {
        try {
            const data: string | null = this.client.getItem(this.configuration.fileName);
            return (data !== null) ? this.formatResponse(data) : [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    private formatResponse(data: string): Environment[] {
        const savedEnvironments: Environment[] = JSON.parse(data);
        const environments:Environment[] = [];

        savedEnvironments.forEach(env => {
            environments.push(new Environment(env.name, env.taken, env.takenAt, env.takenBy));
        });
        return environments;
    }

}
