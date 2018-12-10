import {Manager} from "./handler";
import {EnvironmentalistServer} from "../index";

/**
 * Configuration data for running app server.
 */
export class Configuration {
    private static Defaults = {
        slackUrl: "https://slack.com",
        serverHost: "http://localhost",
    };

    public environments: string[];
    public serverPort: number;
    public serverHost: string;
    public slackUrl: string;
    public slackAuthHeader : string;

    public constructor(environments: string[], serverPort: number, slackAuthHeader: string) {
        this.environments = environments;
        this.serverPort = serverPort;
        this.serverHost = Configuration.Defaults.serverHost;
        this.slackUrl = Configuration.Defaults.slackUrl;
        this.slackAuthHeader = slackAuthHeader;
    }
}

/**
 * Singleton wrapper that contains app configuration details.
 */
export class App {
    public static config: Configuration;

    public static init(config: Configuration) {
        this.config = config;

        Manager.initEnvironments(config.environments)
        this.initServer();
    }

    private static initServer() {
        const port: number  = App.config.serverPort;
        const host: string  = App.config.serverHost;

        EnvironmentalistServer.listen(port, () => {
            console.log(`Welcome to Environmentalist`);
            console.log(`Environmentalist listening at: ${host}:${port}/`);
        });
    }
}