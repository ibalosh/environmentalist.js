/**
 * Configuration data for running app server.
 */

export class Configuration {
    private static Defaults = {
        slackUrl: "https://slack.com",
        dynamoDBTable: 'environmentalist'
    };

    public environments: string[];
    public slackUrl: string;
    public slackAuthHeader: string;
    public configDataPath: string;
    public configFileName: string;
    public configDBTableName: string;
    public configStorage: string;

    public constructor(environments: string[], serverPort: number, slackAuthHeader: string, configDataPath: string, configFileName: string, configStorage: string) {
        this.environments = environments;
        this.slackUrl = Configuration.Defaults.slackUrl;
        this.slackAuthHeader = slackAuthHeader;
        this.configDataPath = configDataPath;
        this.configFileName = configFileName;
        this.configDBTableName = Configuration.Defaults.dynamoDBTable;
        this.configStorage = configStorage;
    }
}

export class ServerConfiguration {
    private static Defaults = {
        serverHost: "0.0.0.0"
    };

    public serverPort: number;
    public serverHost: string;
    public serverAuthUsername?: string;
    public serverAuthPassword?: string;
    public serverAuthEnabled: boolean;

    public constructor(serverPort: number, serverAuthEnabled: boolean, serverAuthUsername?: string, serverAuthPassword?: string) {
        this.serverPort = serverPort;
        this.serverHost = ServerConfiguration.Defaults.serverHost;
        this.serverAuthEnabled = serverAuthEnabled;

        if (serverAuthEnabled === true) {
            this.serverAuthUsername = serverAuthUsername;
            this.serverAuthPassword = serverAuthPassword;
        }
    }
}
