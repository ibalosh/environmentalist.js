import {Environment, Environments} from "../index";
import {User} from "../index";
import {Response} from "../index";

export class Manager {
    private environments: Environments;
    private readonly response: Response;

    constructor(environmentNames: string[]) {
        this.environments = new Environments();
        environmentNames.forEach((name: string) => { this.environments.addEnvironment(new Environment(name)) });

        this.response = new Response();
    }

    public takeEnvironmentAndRespond(message: string, user: User): Response {
        try {
            this.takeEnvironment(message, user);
            this.response.setResponse('Environment taken.');
        } catch(error) {
            this.response.setResponse(error.message);
        }
        return this.response;
    }

    public freeEnvironmentAndRespond(message: string, user: User): Response {
        try {
            this.freeEnvironment(message, user);
            this.response.setResponse('Environment freed.');
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

    private parseMessage(message: string): { environmentName: string, forceTakingEnvironment: boolean } {
        const messageArray: string[] = message.trim().split(" ").filter(String);
        return {
            environmentName: messageArray[0],
            forceTakingEnvironment: messageArray.length > 1
        }
    }
}