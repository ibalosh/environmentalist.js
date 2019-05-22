import {Environment, User, Response} from "../index";
import * as Errors from "./Errors";
import DataSaver from "./DataSaver"
import moment = require("moment");
import {setInterval} from "timers";

interface IParsedMessage {
    environmentName: string;
    forceTakingEnvironment: boolean;
    branchBackend: string,
    branchFrontend: string
}

/**
 * Class which is in charge of all the management related to environment and returning a proper response.
 * For example if environment is taken, it should handle this action and return proper response to API.
 */
export class Manager {
    public static environments: Environment[] = [];
    protected response: Response;
    private static dataSaver: DataSaver = new DataSaver()

    constructor(response: Response) {
        this.response = response;
    }

    /**
     * Initialize environments based on their name.
     * @param {string[]} environmentNames - names of environments
     */
    public static initEnvironments(environmentNames: string[]): void {
        if (Manager.setEnvironmentsStateFromFile() === false) {
            Manager.environments = [];
            environmentNames.forEach((environmentName: string) => {
                Manager.environments.push(new Environment(environmentName))
            });
        }

        const maxReservationInSeconds: number = 60 * 60 * 8; // 8 hours
        const checkReservationPeriodSeconds: number = 1000 * 60 * 30; // 30 minutes

        /**
         * check if environment taken for more than
         */
        setInterval(() => {
            Manager.environments.forEach( (environment: Environment) => {
                if (environment.takenAt !== null) {
                    const currentTime: number  = Math.floor(new Date().valueOf()/1000)
                    const envTime: any = Math.floor(new Date(environment.takenAt).valueOf()/1000);
                    if (currentTime - envTime > maxReservationInSeconds) { environment.free(new User(), true); }
                }
            });

            Manager.dataSaver.preserveState(Manager.environments);
        }, checkReservationPeriodSeconds);
    }

    public static clearEnvironmentsStateFile(): void {
        Manager.dataSaver.clearState();
    }

    /**
     * Initialize environments with all their states set, from file.
     * @returns {boolean} - true if operation was executed
     */
    private static setEnvironmentsStateFromFile(): boolean {
        const environments = Manager.dataSaver.retrieveState();

        if (environments !== null) {
            Manager.environments = environments;
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Retrieve environment names.
     *
     * @returns {string[]} - environment names
     */
    public getEnvironmentNames(): string[] {
        return Manager.environments.map( environment => environment.name );
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
            Manager.dataSaver.preserveState(Manager.environments);
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
            Manager.dataSaver.preserveState(Manager.environments);
        } catch (error) {
            this.handleErrors(error, environmentName, user)
        }

        return this.response;
    }

    /**
     * Free environment, if possible.
     *
     * @param {string} message - message that contains environment name amongst other information
     * @param {User} user - user requesting environment action
     * @returns {Response} - response based on users request
     */
    public takeEnvironmentByMessage(message: string, user: User): Response {
        const parsedMessage = this.parseMessage(message);
        const environmentName: string = parsedMessage.environmentName;
        const forceTakingEnvironment: boolean = parsedMessage.forceTakingEnvironment;

        return this.takeEnvironment(environmentName, user, forceTakingEnvironment);
    }

    /**
     * Split string message.
     *
     * @param {string} messageToBeParsed - message to split into meaningfull actions
     * @returns {IParsedMessage} - actions to be taken to environment
     */
    private parseMessage(messageToBeParsed: string): IParsedMessage {
        const messageParts: string[] = messageToBeParsed.trim().split(" ").filter(String);
        return {
            environmentName: messageParts[0],
            forceTakingEnvironment: messageParts.length > 1,
            branchFrontend: messageParts[0],
            branchBackend: messageParts[0]
        }
    }

    /**
     * Handle gracefully errors that could happen while managing environments, like when environment doesn't exist.
     *
     * @param {EnvironmentalistError} error - error to be handled
     * @param {string} environmentName - environment on which error happened by name
     * @param {User} user - user that caused error
     */
    private handleErrors(error: Errors.EnvironmentalistError, environmentName: string, user: User): void {
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

    private handleEnvironmentRetrieval(environmentFound: Environment | undefined, environmentName: string):Environment {
        if (Manager.environments.length < 1) {
            throw new Errors.EnvironmentalistError('Environments are not initialized.');
        }

        if (environmentFound === undefined) {
            throw new Errors.EnvironmentNotExistingError(`Environment '${environmentName}' doesn't exist.`);
        } else {
            return environmentFound;
        }
    }
}
