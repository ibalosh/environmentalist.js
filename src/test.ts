import * as model from "./model";

const environmentNames = require("./../environments.json");

const manager: model.Manager = new model.Manager(environmentNames);

const user: model.User = new model.User('ibalosh', 123);


console.log(manager.takeEnvironmentAndRespond('staging1', user));
console.log(manager.takeEnvironmentAndRespond('staging1', user));
console.log(manager.freeEnvironmentAndRespond('staging1', user));
