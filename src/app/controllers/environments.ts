import { Router, Request, Response } from 'express';
import {Manager, SlackUser} from "../../model";

const environmentNames = require("./../../../environments.json");
const router: Router = Router();

const manager: Manager = new Manager(environmentNames);

router.get('/welcome',function (req: any, res: any) {
    //let response = envHandler.freeEnvironment(req.body.text, req.body.user_name);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send("Welcome to the app");
});

router.post('/free', function (req: any, res: any) {
    //let response = envHandler.freeEnvironment(req.body.text, req.body.user_name);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(req.body.text);
});

// take one of existing environments
router.post('/take', function (req, res) {
    let response:any = manager.takeEnvironmentWithResponse(req.body.text, new SlackUser(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(response.message);

});

// Export the express.Router() instance to be used by server.ts
export const EnvironmentController: Router = router;