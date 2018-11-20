import {Environment} from "./environment";
import {User} from "./User";
import * as Errors from "./Errors";


export class Environments {
    private environments: Environment[];

    constructor(environmentNames: string[]) {
        this.environments = [];
        environmentNames.forEach((name: string) => { this.addEnvironment(new Environment(name)) });
    }

    public addEnvironment(environment: Environment) {
        this.environments.push(environment);
    }

    public takeEnvironment(environmentName: string, user: User, forceTake: boolean): void {
        if (this.isEnvironmentFree(environmentName) || forceTake === true) {
            this.retrieveEnvironment(environmentName).take(user);
        }
        else {
            throw new Errors.TakeEnvironmentError(`Environment '${environmentName}' is already taken.`);
        }
    }

    public freeEnvironment(environmentName: string, user: User): void {
        if (this.isEnvironmentTakenByUser(environmentName, user.username)) {
            this.retrieveEnvironment(environmentName).free();
        }
        else if (this.isEnvironmentFree(environmentName)) {
            throw new Errors.FreeEnvironmentError(`Environment '${environmentName}' is already free.`);
        }
        else {
            throw new Errors.FreeEnvironmentError(`Environment '${environmentName}' can only be freed by user '${this.getEnvironmentTakenByUser(environmentName)}'.`);
        }
    }

    private retrieveEnvironment(environmentName: string): Environment {
        const environment: Environment | undefined = this.environments.find(function (environment) {
            return environment.name === environmentName;
        });

        if (environment === undefined) {
            throw new Errors.HabitatError(`Environment '${environmentName}' doesn't exist. Available environments are: '${this.getEnvironmentNames().join(", ")}'.`);
        } else {
            return environment;
        }
    }

    private getEnvironmentTakenByUser(environmentName: string): string {
        return this.retrieveEnvironment(environmentName).getTakenByUser()
    }

    private isEnvironmentTakenByUser(environmentName: string, username: string): boolean {
        return this.retrieveEnvironment(environmentName).getTakenByUser() === username;
    }

    private isEnvironmentFree(environmentName: string): boolean {
        return !this.retrieveEnvironment(environmentName).taken;
    }

    private getEnvironmentNames() {
        return this.environments.map( environment => environment.name );
    }
}