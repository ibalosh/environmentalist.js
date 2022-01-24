import {Configuration, ServerConfiguration} from "./Configuration";
import {Manager} from "./handler";
import {Server} from "./index";
import {Application} from "express";

/**
 * Singleton wrapper that contains app configuration details.
 */
export class App {
    public static config: Configuration;
    public static serverConfig: ServerConfiguration;

    public static async init(config: Configuration, serverConfig: ServerConfiguration) {
        this.config = config;
        this.serverConfig = serverConfig;

        if (this.config.configStorage.includes('db')) {
            console.log('Use AWS DynamoDB for storage.')
            Manager.initDBStorage(config.configDBTableName);
        } else {
            console.log('Use file for storage.')
            Manager.initFileStorage(config.configDataPath, config.configFileName)
        }

        await Manager.initEnvironments(config.environments);
        this.initServer();
    }

    private static initServer(): void {
        const port: number = App.serverConfig.serverPort;
        const host: string = App.serverConfig.serverHost;
        const serverAuthUsername = App.serverConfig.serverAuthUsername;
        const serverAuthPassword = App.serverConfig.serverAuthPassword;
        const serverAuthEnabled = App.serverConfig.serverAuthEnabled;

        const server: Application = new Server(serverAuthEnabled, serverAuthUsername, serverAuthPassword).app;

        server.listen(port, () => {
            console.log(`Welcome to Environmentalist`);
            console.log(`Environmentalist listening at: ${host}:${port}/`);
        });
    }
}
