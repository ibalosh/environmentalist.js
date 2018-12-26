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

    public constructor(environments: string[], serverPort: number, slackAuthHeader: string) {
      this.environments = environments;
      this.serverPort = serverPort;
      this.serverHost = Configuration.Defaults.serverHost;
      this.slackUrl = Configuration.Defaults.slackUrl;
      this.slackAuthHeader = slackAuthHeader;
    }
}
