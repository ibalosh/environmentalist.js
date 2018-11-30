import {HabitatServer} from "./index";

const config = require("./../config.json");
const port  = config.port;
const host  = config.host;

HabitatServer.listen(port, () => {
    console.log(`Habitat listening at ${host}:${port}/`);
});