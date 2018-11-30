import {Environment, User, Response} from "../index";
import * as Errors from "./Errors";

interface IParsedTakeEnvironmentMessage {
    environmentName: string;
    forceTakingEnvironment: boolean;
}

/**
 * Class which is in charge of all the management related to environment and returning a proper response.
 * For example if environment is taken, it should handle this action and return proper response to API.
 */
export class Manager {
    protected static environments: Environment[] = [];
    protected response: Response;

    constructor(response: Response) {
        this.response = response;
    }

    /**
     * Initialize environments based on their name.
     * @param {string[]} environmentNames - names of environments
     */
    public static initEnvironments(environmentNames: string[]) {
        environmentNames.forEach((environmentName: string) => {
            Manager.environments.push(new Environment(environmentName)) });
    }

    /**
     * Retrieve environment status
     * @returns {Response} - environment status response for API.
     */
    public environmentStatus(): Response {
        this.response.generateEnvironmentStatusMessage(Manager.environments);
        return this.response;
    }

    /**
     * Free environment, if possible.
     *
     * @param {string} environmentName - environment to be freed by name
     * @param {User} user - user requesting environment action
     * @returns {Response} - response based on users request
     */
    public freeEnvironment(environmentName: string, user: User): Response {
        try {
            this.retrieveEnvironment(environmentName).free(user);
            this.response.generateFreeMessage(environmentName, user);
        } catch (error) {
            this.handleErrors(error, environmentName, user);
        }

        return this.response;
    }

    /**
     * Take environment, if possible.
     *
     * @param {string} environmentName - environment to be freed by name
     * @param {User} user - user requesting environment action
     * @returns {Response} - response based on users request
     */
    public takeEnvironment(environmentName: string, user: User, takeByForce: boolean): Response {
        try {
            this.retrieveEnvironment(environmentName).take(user, takeByForce);
            this.response.generateTakeMessage(environmentName, user);
        } catch (error) {
            this.handleErrors(error, environmentName, user)
        }

        return this.response;
    }

    /**
     * Free environment, if possible.
     *
     * @param {string} message - message that contains environment name amongs other information
     * @param {User} user - user requesting environment action
     * @returns {Response} - response based on users request
     */
    public takeEnvironmentByMessage(message: string, user: User): Response {
        const parsedMessage = this.parseTakeEnvironmentMessage(message);
        const environmentName: string = parsedMessage.environmentName;
        const forceTakingEnvironment: boolean = parsedMessage.forceTakingEnvironment;

        return this.takeEnvironment(environmentName, user, forceTakingEnvironment);
    }

    /**
     * Split string message.
     *
     * @param {string} messageToBeParsed - message to split into meaningfull actions
     * @returns {IParsedTakeEnvironmentMessage} - actions to be taken to environment
     */
    private parseTakeEnvironmentMessage(messageToBeParsed: string): IParsedTakeEnvironmentMessage {
        const messageParts: string[] = messageToBeParsed.trim().split(" ").filter(String);
        return {
            environmentName: messageParts[0],
            forceTakingEnvironment: messageParts.length > 1
        }
    }

    /**
     * Handle gracefully errors that could happen while managing environments, like when environment doesn't exist.
     *
     * @param {HabitatError} error - error to be handled
     * @param {string} environmentName - environment on which error happened by name
     * @param {User} user - user that caused error
     */
    private handleErrors(error: Errors.HabitatError, environmentName: string, user: User): void {
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

    /**
     * Retrieve environment names.
     *
     * @returns {string[]} - environment names
     */
    private getEnvironmentNames(): string[] {
        return Manager.environments.map( environment => environment.name );
    }

    /**
     * Retrieve environment object.
     *
     * @param {string} environmentName - environment name to search for
     * @returns {Environment} - environment
     */
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