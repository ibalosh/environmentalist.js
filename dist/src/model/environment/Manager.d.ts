import { SlackUser } from "../index";
export declare class Manager {
    private environments;
    constructor(environmentNames: string[]);
    takeEnvironment(environmentName: string, user: SlackUser, forceTake?: boolean): void;
    freeEnvironment(environmentName: string, username: string): void;
    private parseMessage;
}
