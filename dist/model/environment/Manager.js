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
    Manager.prototype.takeEnvironmentWithResponse = function (message, user) {
        var response = {
            code: 200,
            message: ''
        };
        try {
            this.takeEnvironment(message, user);
            response.message = 'Environment taken.';
        }
        catch (e) {
            response.message = e;
        }
        return response;
    };
    Manager.prototype.freeEnvironmentWithResponse = function (message, user) {
        var response = {
            code: 200,
            message: ''
        };
        try {
            this.takeEnvironment(message, user);
            response.message = 'Environment taken.';
        }
        catch (e) {
            response.message = e;
        }
        return response;
    };
    Manager.prototype.takeEnvironment = function (message, user) {
        var parsedMessage = this.parseMessage(message);
        this.environments.takeEnvironment(parsedMessage.environmentName, user, parsedMessage.forceTakingEnvironment);
    };
    Manager.prototype.freeEnvironment = function (environmentName, username) {
        this.environments.freeEnvironment(environmentName, new index_2.SlackUser(username));
    };
    Manager.prototype.environmentDetails = function (environmentName) {
        this.environments.retrieveEnvironment(environmentName);
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