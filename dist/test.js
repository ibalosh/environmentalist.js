"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model = require("./model");
var environmentNames = require("./../environments.json");
var manager = new model.Manager(environmentNames);
var user = new model.SlackUser('ibalosh', 123);
manager.takeEnvironment('staging1', user);
manager.takeEnvironment('staging4', user);
manager.freeEnvironment('staging4', user.username);
manager.freeEnvironment('staging1', user.username);
manager.freeEnvironment('staging1', user.username);
manager.takeEnvironment('staging1', user, true);
//# sourceMappingURL=test.js.map