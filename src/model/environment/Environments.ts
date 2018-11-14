import {Environment} from "./environment";
import {User} from "./User";
import * as Errors from "./Errors";


export class Environments {
    private environments: Environment[];

    public constructor() {
        this.environments = [];
    }

    public getEnvironmentNames() {
        return this.environments.map( environment => environment.name );
    }

    public addEnvironment(environment: Environment) {
        this.environments.push(environment);
    }

    public takeEnvironment(environmentName: string, user: User, forceTake: boolean): void {
        if (this.environmentIsFree(environmentName) || forceTake === true) {
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
        else if (this.environmentIsFree(environmentName)) {
            throw new Errors.FreeEnvironmentError(`Environment '${environmentName}' is already free.`);
        }
        else {
            throw new Errors.FreeEnvironmentError(`Environment '${environmentName}' can only be freed by user '${this.getEnvironmentTakenByUser(environmentName)}'.`);
        }
    }

    private getEnvironmentTakenByUser(environmentName: string): string {
        return this.retrieveEnvironment(environmentName).getTakenByUser()
    }

    private isEnvironmentTakenByUser(environmentName: string, username: string): boolean {
        return this.retrieveEnvironment(environmentName).getTakenByUser() === username;
    }

    private environmentIsFree(environmentName: string): boolean {
        return !this.retrieveEnvironment(environmentName).taken;
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
}