import {Manager} from "./handler";

export class Configuration {
    public ENVIRONMENTS: string[];
    public SERVER_PORT: number;
    public SERVER_HOST: string;
    public SLACK_URL: string;
    public SLACK_AUTH_HEADER : string;

    public constructor(environments: string[], serverPort: number, serverHost: string, slackUrl: string, slackAuthHeader: string) {
        this.ENVIRONMENTS = environments;
        this.SERVER_PORT = serverPort;
        this.SERVER_HOST = serverHost;
        this.SLACK_URL = slackUrl;
        this.SLACK_AUTH_HEADER = slackAuthHeader;
    }
}

/**
 * Singleton wrapper that contains app configuration details.
 */
export class Starter {
    public static config: Configuration;

    public static init(config: Configuration) {
        Manager.initEnvironments(config.ENVIRONMENTS)
        this.config = config;
    }

    public static getEnvironments() {
        Manager.environments;
    }
}