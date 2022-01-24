import {
    Environment,
    User,
    Response,
    EnvironmentBrokenNoteMissingError,
    Deployment,
} from "../index";
import {EnvironmentalistFileClient, EnvironmentalistDBClient, StorageClient} from "../index";
import * as Errors from "./Errors";
import {setInterval} from "timers";

interface EnvironmentToTakeParsed {
    environmentName: string;
    forceTakingEnvironment: boolean;
}

interface EnvironmentHealthParsed {
    environmentName: string;
    note: string | null;
}

/**
 * Class which is in charge of all the management related to environment and returning a proper response.
 * For example if environment is taken, it should handle this action and return proper response to API.
 */
export class Manager {
    public static environments: Environment[] = [];
    protected response: Response;
    private static storageClient: StorageClient;

    constructor(response: Response) {
        this.response = response;
    }

    public static initFileStorage(path: string, fileName: string) {
      this.storageClient = new EnvironmentalistFileClient(path, fileName);
    }

    public static initDBStorage(tableName:string) {
        this.storageClient = new EnvironmentalistDBClient(tableName)
    }

    /**
     * Initialize environments based on their name.
     * @param {string[]} environmentNames - names of environments
     * @param {boolean} clearEnvironmentStatesByTime - if environment is take for too long, free it
     */
    public static async initEnvironments(environmentNames: string[], clearEnvironmentStatesByTime: boolean = true) {
        const preservedState = await Manager.setPreservedEnvironmentsState()
        if (!preservedState) {
            Manager.environments = [];
            environmentNames.forEach((environmentName: string) => {
                Manager.environments.push(new Environment(environmentName))
            });
        }

        if (clearEnvironmentStatesByTime) {
            this.clearEnvironmentsPeriodically();
        }

    }

    /**
     * In case that environment is occupied for more than X hours, free environment.
     */
    private static clearEnvironmentsPeriodically() {
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

            Manager.storageClient.saveEnvironmentData(Manager.environments);
        }, checkReservationPeriodSeconds);
    }

    /**
     * Initialize environments with all their states set, from file.
     * @returns {boolean} - true if operation was executed
     */
    private static async setPreservedEnvironmentsState(): Promise<boolean> {
        const environments = await Manager.storageClient.retrieveEnvironmentData();

        if (environments.length !== 0) {
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

    public async environmentDeploymentStatusPage(message: string): Promise<Response> {
        const parsedMessage = this.parseTextMessageForEnvironmentAndNote(message)
        const deployments: Deployment[] = await Manager.storageClient.
        retrieveDeploymentStatusData(parsedMessage.environmentName);
        const filteredDeployments = this.filterByService(deployments, parsedMessage.note || '')

        this.response.generateEnvironmentDeploymentStatusMessage(filteredDeployments);
        return this.response;
    }

    public filterByService(deployments: Deployment[], service: string): Deployment[] {
        if (!service) { return deployments; }
        const wildCardSign:string = '%';
        const searchString = service.replace(new RegExp(`${wildCardSign}`, 'g' ), "");

        if (service.startsWith(wildCardSign) && service.endsWith(wildCardSign)) {
            return this.filterByServiceUsingFunc(deployments, s => s.includes(searchString));
        }

        if (service.startsWith(wildCardSign)) {
            return this.filterByServiceUsingFunc(deployments, s => s.endsWith(searchString));
        }

        if (service.endsWith(wildCardSign)) {
            return this.filterByServiceUsingFunc(deployments, s => s.startsWith(searchString));
        }

        return this.filterByServiceUsingFunc(deployments, s => s == searchString);
    }

    private filterByServiceUsingFunc(deployments: Deployment[], fn: (searchString: string) => boolean) {
        return deployments.filter(r => {
            return fn(r.serviceFormatted.toLowerCase());
        });
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
            Manager.storageClient.saveEnvironmentData(Manager.environments);
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
            Manager.storageClient.saveEnvironmentData(Manager.environments);
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
        const parsedMessage = this.parseTakeEnvironmentMessage(message);
        const environmentName: string = parsedMessage.environmentName;
        const forceTakingEnvironment: boolean = parsedMessage.forceTakingEnvironment;

        return this.takeEnvironment(environmentName, user, forceTakingEnvironment);
    }

    /**
     * Set environment health.
     *
     * @param {boolean} healthy - environment health
     * @param {EnvironmentHealth} note - details about environment health
     * @returns {Response} - environment status response
     */
    public setEnvironmentHealth(message: string, user: User, healthy: boolean): Response {
        const parsedMessage = this.parseTextMessageForEnvironmentAndNote(message)
        const environmentName: string = parsedMessage.environmentName;
        const note: string | null = healthy ? null : parsedMessage.note;

        try {
            this.retrieveEnvironment(environmentName).setHealth(user, healthy, note);
            this.response.generateEnvironmentStatusMessage(Manager.environments);
            Manager.storageClient.saveEnvironmentData(Manager.environments);
        } catch (error) {
            switch (error.name) {
                case Errors.EnvironmentNotExistingError.name:
                    this.response.generateNotExistingEnvironmentMessage(environmentName, this.getEnvironmentNames());
                    break;
                case Errors.EnvironmentBrokenNoteMissingError.name:
                    this.response.generateEnvironmentBrokenNoteMissingMessage();
                    break;
                default:
                    throw error;
            }
        }

        return this.response;
    }

    /**
     * Split string message.
     *
     * @param {string} messageToBeParsed - message to split into meaningfull actions
     * @returns {EnvironmentToTakeParsed} - actions to be taken to environment
     */
    private parseTakeEnvironmentMessage(messageToBeParsed: string): EnvironmentToTakeParsed {
        const messageParts: string[] = messageToBeParsed.toString().trim().split(" ").filter(String);
        return {
            environmentName: messageParts[0],
            forceTakingEnvironment: messageParts.length > 1
        }
    }

    private parseTextMessageForEnvironmentAndNote(messageToBeParsed: string): EnvironmentHealthParsed {
        const messageParts: string[] = messageToBeParsed.toString().trim().split(" ").filter(String);
        const environmentName: any = messageParts.shift();
        const note: string|null = messageParts.length > 0 ? messageParts.join(' ') : null

        return {
            environmentName: environmentName,
            note: note
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
