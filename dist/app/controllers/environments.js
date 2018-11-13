"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var model_1 = require("../../model");
var environmentNames = require("./../../../environments.json");
var router = express_1.Router();
var manager = new model_1.Manager(environmentNames);
router.get('/welcome', function (req, res) {
    //let response = envHandler.freeEnvironment(req.body.text, req.body.user_name);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send("Welcome to the app");
});
router.post('/free', function (req, res) {
    //let response = envHandler.freeEnvironment(req.body.text, req.body.user_name);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(req.body.text);
});
// take one of existing environments
router.post('/take', function (req, res) {
    var response = manager.takeEnvironmentWithResponse(req.body.text, new model_1.SlackUser(req.body.user_name, req.body.user_id));
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(response.message);
});
// Export the express.Router() instance to be used by server.ts
exports.EnvironmentController = router;
//# sourceMappingURL=environments.js.map