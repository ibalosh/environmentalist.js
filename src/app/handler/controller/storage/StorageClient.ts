import {Environment} from "../../model/Environment";

export abstract class StorageClient {
    public client: any;
    public configuration: any;

    public abstract saveEnvironmentData(environments: Environment[]): void;
    public abstract retrieveEnvironmentData(): any;
    public abstract retrieveEnvironmentData(): any;
    public abstract retrieveDeploymentStatusData(filter: any): any;
}