"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var model = require("../src/model");
describe('Manager', function () {
    var environmentNames = require("./../environments.json");
    it('takeEnvironment', function () {
        var username = 'ibalosh';
        var userId = 123;
        var environmentName = environmentNames[0];
        var manager = new model.Manager(environmentNames);
        var user = new model.SlackUser(username, userId);
        manager.takeEnvironment(environmentName, user);
        chai_1.expect(function () { return manager.takeEnvironment(environmentNames[0], user); }).to.throw(/Environment.*is already taken./);
    });
});
//# sourceMappingURL=Manager.test.js.map