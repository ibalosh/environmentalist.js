import * as habitat from "./handler";

const environmentNames = require("./../environments.json");

//const manager: habitat.Manager = new habitat.Manager();
const manager: habitat.SlackManager = new habitat.SlackManager();
habitat.Manager.initEnvironments(environmentNames);

const user: habitat.User = new habitat.User('ibalosh', 123);


console.log(manager.takeEnvironmentAndRespond('staging1', user));
console.log(manager.takeEnvironmentAndRespond('staging1', user));
console.log(manager.freeEnvironmentAndRespond('staging1', user));


/*
curl -X POST localhost:3002/take -H "Content-Type: application/json" -d '{"text": "staging1", "user_name": "ibalosh" }'
 */