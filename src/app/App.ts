import {Configuration} from "./Configuration";
import {Manager} from "./handler";
import {Server} from "./index";

/**
 * Singleton wrapper that contains app configuration details.
 */
export class App {
    public static config: Configuration;

    public static init(config: Configuration) {
      this.config = config;

      Manager.initEnvironments(config.environments);
      this.initServer();
    }

    private static initServer() {
      const port: number = App.config.serverPort;
      const host: string = App.config.serverHost;

      Server.listen(port, () => {
          console.log(`Welcome to Environmentalist`);
          console.log(`Environmentalist listening at: ${host}:${port}/`);
      });
    }
}
