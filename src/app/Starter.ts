import {Manager} from "./handler";
import {EnvironmentalistServer} from "../index";

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
export class App {
    private static Defaults = {
        slackUrl: "https://slack.com",
        serverHost: "http://localhost",
    };

    public static config: Configuration;

    public static init(config: Configuration) {
        config.SLACK_URL = this.Defaults.slackUrl;
        config.SERVER_HOST = this.Defaults.serverHost;
        this.config = config;

        Manager.initEnvironments(config.ENVIRONMENTS)
        this.initServer();
    }

    private static initServer() {
        const port: number  = App.config.SERVER_PORT;
        const host: string  = App.config.SERVER_HOST;

        EnvironmentalistServer.listen(port, () => {
            console.log(`Welcome to Environmentalist`);
            console.log(`Environmentalist listening at: ${host}:${port}/`);
        });
    }
}