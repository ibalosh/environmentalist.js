"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var index_2 = require("../index");
var Manager = /** @class */ (function () {
    function Manager(environmentNames) {
        var environments = new index_1.Environments();
        environmentNames.forEach(function (name) {
            environments.addEnvironment(new index_1.Environment(name));
        });
        this.environments = environments;
    }
    Manager.prototype.takeEnvironment = function (environmentName, user, forceTake) {
        if (forceTake === void 0) { forceTake = false; }
        this.environments.takeEnvironment(environmentName, user, forceTake);
    };
    Manager.prototype.freeEnvironment = function (environmentName, username) {
        this.environments.freeEnvironment(environmentName, new index_2.SlackUser(username));
    };
    Manager.prototype.parseMessage = function (message) {
        var messageArray = message.trim().split(" ").filter(String);
        return {
            environmentName: messageArray[0],
            forceTakingEnvironment: messageArray.length > 1
        };
    };
    return Manager;
}());
exports.Manager = Manager;
//# sourceMappingURL=Manager.js.map