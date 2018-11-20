import { Router } from 'express';
import {ApiResponse, Manager, Response, User} from "../../handler";

const environmentNames = require("./../../../environments.json");
const router: Router = Router();

Manager.initEnvironments(environmentNames);
const environmentManager: Manager = new Manager(new ApiResponse());

router.post('/free', function (req: any, res: any) {
    let response: Response = environmentManager.freeEnvironmentAndRespond(req.body.text, new User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

router.post('/take', function (req, res) {
    let response: Response = environmentManager.takeEnvironmentAndRespond(req.body.text, new User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

export const EnvironmentsAPI: Router = router;