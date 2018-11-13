import { Environment, SlackUser } from "./environment";
export declare class Environments {
    private environments;
    constructor();
    retrieveEnvironmentNames(): string[];
    addEnvironment(environment: Environment): void;
    takeEnvironment(environmentName: string, user: SlackUser, forceTake: boolean): void;
    freeEnvironment(environmentName: string, user: SlackUser): void;
    retrieveEnvironment(environmentName: string): Environment;
    private isEnvironmentOwner;
    private environmentIsFree;
}
