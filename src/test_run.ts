import {EnvironmentalistServer, Environmentalist} from "./index";

const config = require("./../config.json");
Environmentalist.Starter.init(config);

const port  = Environmentalist.Starter.config.SERVER_PORT;
const host  = Environmentalist.Starter.config.SERVER_HOST;

EnvironmentalistServer.listen(port, () => {
    console.log(`Welcome to Environmentalist`);
    console.log(`Environmentalist listening at: ${host}:${port}/`);
});