import {Environment} from "../index";
import {User} from "../index";
import {Response} from "../index";
import * as Errors from "./Errors";

interface ParsedMessage {
    environmentName: string;
    forceTakingEnvironment: boolean;
}

export class Manager {
    protected static environments: Environment[] = [];
    protected response: Response;

    constructor(response: Response = new Response()) {
        this.response = response;
    }

    public static initEnvironments(environmentNames: string[]) {
        environmentNames.forEach((name: string) => { Manager.environments.push(new Environment(name)) });
    }

    public environmentsStatusResponse():Response {
        this.response.setResponse(this.environmentsStatus());
        return this.response;
    }

    public takeEnvironmentAndRespond(message: string, user: User): Response {
        const parsedMessage = this.parseMessage(message);
        const environmentName = parsedMessage.environmentName;
        const forceTakingEnvironment = parsedMessage.forceTakingEnvironment;

        try {
            this.takeEnvironment(environmentName, user, forceTakingEnvironment);
            this.response.setResponse(`Environment "${environmentName}" taken by "${user.username}".`);
        } catch(error) {
            this.response.setResponse(error.message);
        }
        return this.response;
    }

    public freeEnvironmentAndRespond(environmentName: string, user: User): Response {
        try {
            this.freeEnvironment(environmentName, user);
            this.response.setResponse(`Environment "${environmentName}" freed by "${user.username}".`);
        } catch(error) {
            this.response.setResponse(error.message);
        }
        return this.response;
    }

    protected environmentsStatus():any {
        return Manager.environments
    }

    private takeEnvironment(environmentName: string, user: User, forceTakingEnvironment: boolean): void {
        if (this.isEnvironmentFree(environmentName) || forceTakingEnvironment === true) {
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
            throw new Errors.HabitatError(`Environment '${environmentName}' doesn't exist.`);
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