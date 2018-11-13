import { SlackUser } from "../index";
export declare class Manager {
    private environments;
    constructor(environmentNames: string[]);
    takeEnvironmentWithResponse(message: string, user: SlackUser): any;
    freeEnvironmentWithResponse(message: string, user: SlackUser): any;
    takeEnvironment(message: string, user: SlackUser): void;
    freeEnvironment(environmentName: string, username: string): void;
    private environmentDetails;
    private parseMessage;
}
