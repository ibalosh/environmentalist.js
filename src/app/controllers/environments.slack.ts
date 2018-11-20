import { Router } from 'express';
import {Manager, Response, SlackResponse, User} from "../../model";
import {environments} from "./environments";

const router: Router = Router();
const environmentManager: Manager = new Manager(environments, new SlackResponse());

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

export const EnvironmentsSlackAPI: Router = router;