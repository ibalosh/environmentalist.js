import {Environment, Environments} from "../index";
import {User} from "../index";
import {Response, ApiResponse, SlackResponse} from "../index";

interface ParsedMessage {
    environmentName: string;
    forceTakingEnvironment: boolean;
}

export class Manager {
    private readonly environments: Environments;
    private readonly response: Response;

    constructor(environments: Environments, response: Response = new ApiResponse()) {
        this.environments = environments;
        this.response = response;
    }

    public getEnvironments(): Environments {
        return this.environments;
    }

    public takeEnvironmentAndRespond(message: string, user: User): Response {
        try {
            this.takeEnvironment(message, user);
            this.response.setResponse(`Environment taken by ${user.username}.`);
        } catch(error) {
            this.response.setResponse(error.message);
        }
        return this.response;
    }

    public freeEnvironmentAndRespond(message: string, user: User): Response {
        try {
            this.freeEnvironment(message, user);
            this.response.setResponse(`Environment freed by ${user.username}.`);
        } catch(error) {
            this.response.setResponse(error.message);
        }
        return this.response;
    }
    
    public takeEnvironment(message: string, user: User): void {
        const parsedMessage = this.parseMessage(message);
        this.environments.takeEnvironment(parsedMessage.environmentName, user, parsedMessage.forceTakingEnvironment);
    }

    public freeEnvironment(environmentName: string, user: User): void {
        this.environments.freeEnvironment(environmentName, user);
    }

    private parseMessage(message: string): ParsedMessage {
        const messageArray: string[] = message.trim().split(" ").filter(String);
        return {
            environmentName: messageArray[0],
            forceTakingEnvironment: messageArray.length > 1
        }
    }
}