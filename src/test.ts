import * as habitat from "./handler";

const environmentNames = require("./../environments.json");

const manager: habitat.Manager = new habitat.Manager();
habitat.Manager.initEnvironments(environmentNames);

const user: habitat.User = new habitat.User('ibalosh', 123);


console.log(manager.takeEnvironmentAndRespond('staging1', user));
console.log(manager.takeEnvironmentAndRespond('staging1', user));
console.log(manager.freeEnvironmentAndRespond('staging1', user));
