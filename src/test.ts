import * as model from "./model";

const environmentNames = require("./../environments.json");

const manager: model.Manager = new model.Manager(environmentNames);

const user: model.SlackUser = new model.SlackUser('ibalosh', 123);


manager.takeEnvironment('staging1', user);
manager.takeEnvironment('staging4', user);
manager.freeEnvironment('staging4', user.username);
manager.freeEnvironment('staging1', user.username);
manager.freeEnvironment('staging1', user.username);
manager.takeEnvironment('staging1', user, true);