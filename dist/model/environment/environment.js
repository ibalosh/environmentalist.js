"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SlackChannel = /** @class */ (function () {
    function SlackChannel(id) {
        if (id === void 0) { id = null; }
        this.id = id;
    }
    return SlackChannel;
}());
exports.SlackChannel = SlackChannel;
var SlackUser = /** @class */ (function () {
    function SlackUser(username, id) {
        if (username === void 0) { username = ''; }
        if (id === void 0) { id = -1; }
        this.username = username;
        this.id = id;
    }
    return SlackUser;
}());
exports.SlackUser = SlackUser;
var EnvironmentAvailability = /** @class */ (function () {
    function EnvironmentAvailability(taken, takenAt, takenBy) {
        if (taken === void 0) { taken = false; }
        if (takenAt === void 0) { takenAt = null; }
        if (takenBy === void 0) { takenBy = new SlackUser(); }
        this.taken = taken;
        this.takenAt = takenAt;
        this.takenBy = takenBy;
    }
    EnvironmentAvailability.prototype.isTakenByUser = function (username) {
        return this.takenBy.username === username;
    };
    return EnvironmentAvailability;
}());
exports.EnvironmentAvailability = EnvironmentAvailability;
var Environment = /** @class */ (function () {
    function Environment(name, availability) {
        if (availability === void 0) { availability = new EnvironmentAvailability(); }
        this.name = name;
        this.availability = availability;
    }
    Environment.prototype.isTakenByUser = function (username) {
        return this.availability.isTakenByUser(username.toString());
    };
    Environment.prototype.isTaken = function () {
        return this.availability.taken;
    };
    return Environment;
}());
exports.Environment = Environment;
//# sourceMappingURL=environment.js.map