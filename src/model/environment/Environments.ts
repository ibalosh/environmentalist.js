import {Environment, EnvironmentAvailability, SlackUser} from "./environment";

export class Environments {
    private environments: Environment[];

    public constructor() {
        this.environments = [];
    }

    public retrieveEnvironmentNames() {
        return this.environments.map( environment => environment.name );
    }

    public addEnvironment(environment: Environment) {
        this.environments.push(environment);
    }

    public takeEnvironment(environmentName: string, user: SlackUser, forceTake: boolean): void {
        const environment: Environment = this.retrieveEnvironment(environmentName);
        if (this.environmentIsFree(environmentName) || forceTake === true) {
            environment.availability = new EnvironmentAvailability(true, new Date(), user);
        }
        else {
            throw Error(`Environment ${environmentName} is already taken.`);
        }
    }

    public freeEnvironment(environmentName: string, user: SlackUser): void {
        const environment: Environment = this.retrieveEnvironment(environmentName);

        if (this.isEnvironmentOwner(environmentName, user.username)) {
            environment.availability = new EnvironmentAvailability();
        }
        else if (this.environmentIsFree(environmentName)) {
            throw Error(`Environment ${environmentName} is already free.`);
        }
        else {
            throw Error(`Environment ${environmentName} can't be freed by user ${user.username}.`);
        }
    }

    public retrieveEnvironment(environmentName: string): Environment {
        const environment: Environment | undefined = this.environments.find(function (environment) {
            return environment.name === environmentName;
        });

        if (environment === undefined) {
            throw Error(`Environment ${environmentName} doesn't exist. Available environments are: ${this.retrieveEnvironmentNames().join(", ")}.`);
        } else {
            return environment;
        }
    }

    private isEnvironmentOwner(environmentName: string, username: string): boolean {
        return this.retrieveEnvironment(environmentName).isTakenByUser(username);
    }

    private environmentIsFree(environmentName: string): boolean {
        return !this.retrieveEnvironment(environmentName).isTaken();
    }
}