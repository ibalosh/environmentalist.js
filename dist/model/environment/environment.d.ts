export declare class SlackChannel {
    id: number | null;
    constructor(id?: number | null);
}
export declare class SlackUser {
    username: string;
    id: number;
    constructor(username?: string, id?: number);
}
export declare class EnvironmentAvailability {
    taken: boolean;
    takenAt: Date | null;
    takenBy: SlackUser;
    constructor(taken?: boolean, takenAt?: Date | null, takenBy?: SlackUser);
    isTakenByUser(username: string): boolean;
}
export declare class Environment {
    name: string;
    availability: EnvironmentAvailability;
    constructor(name: string, availability?: EnvironmentAvailability);
    isTakenByUser(username: string): boolean;
    isTaken(): boolean;
}
