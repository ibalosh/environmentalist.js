import * as environmentalist from "./index";

if (process.env.APP_ENVIRONMENTS === undefined) { throw new Error("Environments not defined, should be defined as " +
  "APP_ENVIROINMENTS='staging production experimental'.") };
if (process.env.APP_PORT === undefined) { throw new Error("Port not defined.") };
if (process.env.APP_CONFIG_PATH === undefined) { throw new Error("Configuration store path not defined.") };
if (process.env.SLACK_AUTH_HEADER === undefined) { throw new Error("Slack auth header not defined.") };

const environments: string[] = process.env.APP_ENVIRONMENTS.trim().split(' ')
const serverPort:number = Number.parseInt(process.env.APP_PORT);
const configDataPath: string = process.env.APP_CONFIG_PATH;
const slackAuthHeader:string = process.env.SLACK_AUTH_HEADER;

const config: environmentalist.Configuration = new environmentalist.Configuration(
  environments, serverPort, slackAuthHeader, configDataPath);

environmentalist.App.init(config);
