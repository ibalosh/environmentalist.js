import {Environment, User} from "..";

export abstract class Response {
    public message: any;
    public statusCode: number;

    public constructor(message: any = null, statusCode: number = 200) {
        this.message = message;
        this.statusCode = statusCode;
    }

    public abstract generateTakeMessage(environmentName: string, user: User): void;

    public abstract generateAlreadyTakenMessage(environment: Environment, user: User): void;

    public abstract generateFreeMessage(environmentName: string, user: User): void;

    public abstract generateDeniedFreeMessage(environment: Environment): void;

    public abstract generateNotExistingEnvironmentMessage(environmentName: string, environmentNames: string[]): void;

    public abstract generateEnvironmentStatusMessage(environments: Environment[]): void;
}


export class ApiResponse extends Response {
    public generateTakeMessage(environmentName: string, user: User): void {
        this.message = `Environment "${environmentName}" taken by "${user.username}".`;
    }

    public generateAlreadyTakenMessage(environment: Environment, user: User): void {
        this.message = `Can <@${user.id}> take environment ${environment.name} <@${environment.takenBy.id}>?.`;
    }

    public generateFreeMessage(environmentName: string, user: User): void {
        this.message = `Environment "${environmentName}" freed by "${user.username}".`;
    }

    public generateDeniedFreeMessage(environment: Environment): void {
        this.message = `Environment "${environment.name}" can only be freed by user "${environment.takenBy.username}".`;
    }

    public generateNotExistingEnvironmentMessage(environmentName: string, environmentNames: string[]) {
        this.message = `Environment "${environmentName}" doesn't exist. Available environments are: "${environmentNames.join(", ")}".`;
    }

    public generateEnvironmentStatusMessage(environments: Environment[]) {
        this.message = environments;
    }
}