import {Environment, HabitatError} from "../index";
import {User} from "../index";
import {Response} from "../index";
import * as Errors from "./Errors";

interface IParsedTakeEnvironmentMessage {
    environmentName: string;
    forceTakingEnvironment: boolean;
}

export class Manager {
    protected static environments: Environment[] = [];
    protected response: Response;

    constructor(response: Response) {
        this.response = response;
    }

    public static initEnvironments(environmentNames: string[]) {
        environmentNames.forEach((environmentName: string) => {
            Manager.environments.push(new Environment(environmentName)) });
    }

    public environmentStatus(): Response {
        this.response.generateEnvironmentStatusMessage(Manager.environments);
        return this.response;
    }

    public freeEnvironment(environmentName: string, user: User): Response {
        try {
            this.retrieveEnvironment(environmentName).free(user);
            this.response.generateFreeMessage(environmentName, user);
        } catch (error) {
            this.handleErrors(error, environmentName, user);
        }

        return this.response;
    }

    public takeEnvironment(environmentName: string, user: User, takeByForce: boolean): Response {
        try {
            this.retrieveEnvironment(environmentName).take(user, takeByForce);
            this.response.generateTakeMessage(environmentName, user);
        } catch (error) {
            this.handleErrors(error, environmentName, user)
        }

        return this.response;
    }

    public takeEnvironmentByMessage(message: string, user: User): Response {
        const parsedMessage = this.parseTakeEnvironmentMessage(message);
        const environmentName: string = parsedMessage.environmentName;
        const forceTakingEnvironment: boolean = parsedMessage.forceTakingEnvironment;

        return this.takeEnvironment(environmentName, user, forceTakingEnvironment);
    }

    private parseTakeEnvironmentMessage(message: string): IParsedTakeEnvironmentMessage {
        const messageParts: string[] = message.trim().split(" ").filter(String);
        return {
            environmentName: messageParts[0],
            forceTakingEnvironment: messageParts.length > 1
        }
    }

    private handleErrors(error: HabitatError, environmentName: string, user: User): void {
        switch (error.name) {
            case Errors.EnvironmentNotExistingError.name:
                this.response.generateNotExistingEnvironmentMessage(environmentName, this.getEnvironmentNames());
                break;
            case Errors.EnvironmentAlreadyTakenError.name:
                this.response.generateAlreadyTakenMessage(this.retrieveEnvironment(environmentName), user);
                break;
            case Errors.EnvironmentFreeError.name:
                this.response.generateDeniedFreeMessage(this.retrieveEnvironment(environmentName));
                break;
            default:
                throw error;
                break;
        }
    }

    private getEnvironmentNames(): string[] {
        return Manager.environments.map( environment => environment.name );
    }

    private retrieveEnvironment(environmentName: string): Environment {
        const environmentFound: Environment | undefined = Manager.environments.find(function (environment) {
            return environment.name === environmentName;
        });

        return this.handleEnvironmentRetrieval(environmentFound, environmentName);
    }

    private handleEnvironmentRetrieval(environmentFound: Environment | undefined, environmentName: string) {
        if (environmentFound === undefined) {
            throw new Errors.EnvironmentNotExistingError(`Environment '${environmentName}' doesn't exist.`);
        } else {
            return environmentFound;
        }
    }
}