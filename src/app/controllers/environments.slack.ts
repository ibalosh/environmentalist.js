import { Router } from 'express';
import {Response, SlackManager, User} from "../../handler";

const router: Router = Router();
const environmentManager: SlackManager = new SlackManager(new Response());

router.post('/status', function (req: any, res: any) {
    let response: Response = environmentManager.environmentsStatusResponse();

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

router.post('/free', function (req: any, res: any) {
    let response: Response = environmentManager.freeEnvironmentAndRespond(
        req.body.text, new User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

router.post('/take', function (req, res) {
    let response: Response = environmentManager.takeEnvironmentAndRespond(
        req.body.text, new User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

export const EnvironmentsSlackAPI: Router = router;