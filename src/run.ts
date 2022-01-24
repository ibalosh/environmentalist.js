import * as environmentalist from "./app";

if (process.env.APP_ENVIRONMENTS === undefined) {
    throw new Error("Environments not defined, should be defined as " +
        "APP_ENVIROINMENTS='staging production experimental'.") };

if (process.env.SLACK_AUTH_HEADER === undefined) { throw new Error("Slack auth header not defined.") };
if (process.env.APP_PORT === undefined) { throw new Error("Port not defined.") };
if (process.env.APP_CONFIG_PATH === undefined) { throw new Error("Configuration store path not defined.") };
if (process.env.APP_USERNAME === undefined) { throw new Error("Username not defined.") };
if (process.env.APP_PASSWORD === undefined) { throw new Error("Password not defined.") };
if (process.env.APP_AUTH === undefined) { throw new Error("Auth not defined.") };
if (process.env.APP_CONFIG_STORAGE === undefined) { throw new Error("STORAGE not defined.") };

const environments: string[] = process.env.APP_ENVIRONMENTS.trim().split(' ')
const configDataPath: string = process.env.APP_CONFIG_PATH;
const configFileName: string = 'environments.json';
const configStorage: string = process.env.APP_CONFIG_STORAGE.trim().toLowerCase();
const slackAuthHeader:string = process.env.SLACK_AUTH_HEADER;

const serverPort:number = Number.parseInt(process.env.APP_PORT);
const serverAuthUsername = process.env.APP_USERNAME;
const serverAuthPassword = process.env.APP_PASSWORD;
const serverAuthEnabled:boolean = (process.env.APP_AUTH).toString().toLowerCase().includes('true');

const config = new environmentalist.Configuration(environments, serverPort, slackAuthHeader,
    configDataPath, configFileName, configStorage);

const serverConfig = new environmentalist.ServerConfiguration(serverPort,
    serverAuthEnabled, serverAuthUsername, serverAuthPassword);
environmentalist.App.init(config, serverConfig).catch(error => {
    throw Error(error);
})