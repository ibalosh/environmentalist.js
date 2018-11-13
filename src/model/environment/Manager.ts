import {Environment, Environments} from "../index";
import {SlackUser} from "../index";

export class Manager {
    private environments: Environments;

    constructor(environmentNames: string[]) {
        let environments = new Environments();
        environmentNames.forEach((name: string) => {
            environments.addEnvironment(new Environment(name))
        });
        this.environments = environments;
    }

    public takeEnvironmentWithResponse(message: string, user: SlackUser): any {
        let response:any = {
            code: 200,
            message: ''
        };

        try {
            this.takeEnvironment(message, user);
            response.message = 'Environment taken.';
        } catch(e) {
            response.message = e;
        }
        return response;
    }

    public freeEnvironmentWithResponse(message: string, user: SlackUser): any {
        let response:any = {
            code: 200,
            message: ''
        };

        try {
            this.takeEnvironment(message, user);
            response.message = 'Environment taken.';
        } catch(e) {
            response.message = e;
        }
        return response;
    }

    public takeEnvironment(message: string, user: SlackUser): void {
        const parsedMessage = this.parseMessage(message);
        this.environments.takeEnvironment(parsedMessage.environmentName, user, parsedMessage.forceTakingEnvironment);
    }

    public freeEnvironment(environmentName: string, username: string): void {
        this.environments.freeEnvironment(environmentName, new SlackUser(username));
    }

    private environmentDetails(environmentName: string) {
        this.environments.retrieveEnvironment(environmentName);
    }

    private parseMessage(message: string): { environmentName: string, forceTakingEnvironment: boolean } {
        const messageArray: string[] = message.trim().split(" ").filter(String)
        return {
            environmentName: messageArray[0],
            forceTakingEnvironment: messageArray.length > 1
        }
    }
}