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
    public slackAuthHeader: string;
    public configDataPath: string;

    public constructor(environments: string[], serverPort: number, slackAuthHeader: string, configDataPath: string) {
        this.environments = environments;
        this.serverPort = serverPort;
        this.serverHost = Configuration.Defaults.serverHost;
        this.slackUrl = Configuration.Defaults.slackUrl;
        this.slackAuthHeader = slackAuthHeader;
        this.configDataPath = configDataPath;
    }
}
