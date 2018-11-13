"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var Environments = /** @class */ (function () {
    function Environments() {
        this.environments = [];
    }
    Environments.prototype.retrieveEnvironmentNames = function () {
        return this.environments.map(function (environment) { return environment.name; });
    };
    Environments.prototype.addEnvironment = function (environment) {
        this.environments.push(environment);
    };
    Environments.prototype.takeEnvironment = function (environmentName, user, forceTake) {
        var environment = this.retrieveEnvironment(environmentName);
        if (this.environmentIsFree(environmentName) || forceTake === true) {
            environment.availability = new environment_1.EnvironmentAvailability(true, new Date(), user);
        }
        else {
            throw Error("Environment " + environmentName + " is already taken.");
        }
    };
    Environments.prototype.freeEnvironment = function (environmentName, user) {
        var environment = this.retrieveEnvironment(environmentName);
        if (this.isEnvironmentOwner(environmentName, user.username)) {
            environment.availability = new environment_1.EnvironmentAvailability();
        }
        else if (this.environmentIsFree(environmentName)) {
            throw Error("Environment " + environmentName + " is already free.");
        }
        else {
            throw Error("Environment " + environmentName + " can't be freed by user " + user.username + ".");
        }
    };
    Environments.prototype.retrieveEnvironment = function (environmentName) {
        var environment = this.environments.find(function (environment) {
            return environment.name === environmentName;
        });
        if (environment === undefined) {
            throw Error("Environment " + environmentName + " doesn't exist. Available environments are: " + this.retrieveEnvironmentNames().join(", ") + ".");
        }
        else {
            return environment;
        }
    };
    Environments.prototype.isEnvironmentOwner = function (environmentName, username) {
        return this.retrieveEnvironment(environmentName).isTakenByUser(username);
    };
    Environments.prototype.environmentIsFree = function (environmentName) {
        return !this.retrieveEnvironment(environmentName).isTaken();
    };
    return Environments;
}());
exports.Environments = Environments;
//# sourceMappingURL=Environments.js.map