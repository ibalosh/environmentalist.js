"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
describe('Manager', function () {
    it('clientVersion=', function () {
        var customClientVersion = 'test';
        client.clientVersion = customClientVersion;
        chai_1.expect(client.clientVersion).to.equal(customClientVersion);
    });
});
//# sourceMappingURL=Manager.test.js.map