import * as habitat from "./handler";
import {ApiResponse} from "./handler";

const environmentNames = require("./../environments.json");

//const manager: habitat.Manager = new habitat.Manager();
const manager: habitat.Manager = new habitat.Manager(new ApiResponse());
habitat.Manager.initEnvironments(environmentNames);

const user: habitat.User = new habitat.User('ibalosh', 123);


console.log(manager.takeEnvironmentByMessage('staging1', user));
console.log(manager.takeEnvironmentByMessage('staging1', user));
console.log(manager.freeEnvironment('staging1', user));


/*
curl -X POST localhost:3002/take -H "Content-Type: application/json" -d '{"text": "staging1", "user_name": "ibalosh" }'
 */