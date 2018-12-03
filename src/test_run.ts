import {HabitatServer} from "./index";
import {Manager} from "./handler";

const config = require("./../config.json");
Manager.initEnvironments(config.environmentNames);

const port  = config.server.port;
const host  = config.server.host;

HabitatServer.listen(port, () => {
    console.log(`Habitat listening at ${host}:${port}/`);
});