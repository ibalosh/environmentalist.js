import {Environment} from "../index";
import {User} from "../index";
import {Response, ApiResponse, SlackResponse} from "../index";
import * as Errors from "./Errors";
import * as moment from 'moment';

interface ParsedMessage {
    environmentName: string;
    forceTakingEnvironment: boolean;
}

export class Manager {
    private static environments: Environment[] = [];
    private response: Response;

    constructor(response: Response = new ApiResponse()) {
        this.response = response;
    }

    public static initEnvironments(environmentNames: string[]) {
        environmentNames.forEach((name: string) => { Manager.environments.push(new Environment(name)) });
    }

    public environmentsStatusResponse():Response {
        this.response.setResponse(JSON.stringify(this.environmentsStatus()));
        return this.response;
    }

    public takeEnvironmentAndRespond(message: string, user: User): Response {
        try {
            this.takeEnvironment(message, user);
            this.response.setResponse(`Environment taken by "${user.username}".`);
        } catch(error) {
            this.response.setResponse(error.message);
        }
        return this.response;
    }

    public freeEnvironmentAndRespond(message: string, user: User): Response {
        try {
            this.freeEnvironment(message, user);
            this.response.setResponse(`Environment freed by "${user.username}".`);
        } catch(error) {
            this.response.setResponse(error.message);
        }
        return this.response;
    }

    private environmentsStatus():Environment[] {
        return Manager.environments
    }

    private takeEnvironment(message: string, user: User): void {
        const parsedMessage = this.parseMessage(message);
        const environmentName = parsedMessage.environmentName;
        const forceTake = parsedMessage.forceTakingEnvironment;

        if (this.isEnvironmentFree(environmentName) || forceTake === true) {
            this.retrieveEnvironment(environmentName).take(user);
        }
        else {
            throw new Errors.TakeEnvironmentError(`Environment "${environmentName}" is already taken.`);
        }
    }

    private freeEnvironment(environmentName: string, user: User): void {
        if (this.isEnvironmentTakenByUser(environmentName, user.username)) {
            this.retrieveEnvironment(environmentName).free();
        }
        else if (this.isEnvironmentFree(environmentName)) {
            throw new Errors.FreeEnvironmentError(`Environment "${environmentName}" is already free.`);
        }
        else {
            throw new Errors.FreeEnvironmentError(`Environment "${environmentName}" can only be freed by user "${this.getEnvironmentTakenByUser(environmentName)}".`);
        }
    }

    private parseMessage(message: string): ParsedMessage {
        const messageArray: string[] = message.trim().split(" ").filter(String);
        return {
            environmentName: messageArray[0],
            forceTakingEnvironment: messageArray.length > 1
        }

    }

    private retrieveEnvironment(environmentName: string): Environment {
        const environment: Environment | undefined = Manager.environments.find(function (environment) {
            return environment.name === environmentName;
        });

        if (environment === undefined) {
            throw new Errors.HabitatError(`Environment '${environmentName}' doesn't exist. Available environments are: "${this.getEnvironmentNames().join(", ")}".`);
        } else {
            return environment;
        }
    }

    private getEnvironmentTakenByUser(environmentName: string): string {
        return this.retrieveEnvironment(environmentName).getTakenByUser();
    }

    private isEnvironmentTakenByUser(environmentName: string, username: string): boolean {
        return this.retrieveEnvironment(environmentName).getTakenByUser() === username;
    }

    private isEnvironmentFree(environmentName: string): boolean {
        return !this.retrieveEnvironment(environmentName).taken;
    }

    private getEnvironmentNames() {
        return Manager.environments.map( environment => environment.name );
    }

}