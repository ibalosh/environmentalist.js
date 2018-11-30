import {Router, Response, Request} from 'express';
import * as habitat from "../../handler";

const router: Router = Router();
const environmentManager: habitat.Manager = new habitat.Manager(new habitat.SlackResponse());

/**
 * Environments status route.
 */
router.post('/status', function (req: Request, res: Response) {
    let response: habitat.Response = environmentManager.environmentStatus();

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

/**
 * Free environment route.
 */
router.post('/free', function (req: Request, res: Response) {
    let response: habitat.Response = environmentManager.freeEnvironment(
        req.body.text, new habitat.User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

/**
 * Take environment route.
 */
router.post('/take', function (req: Request, res: Response) {
    let response: habitat.Response = environmentManager.takeEnvironmentByMessage(
        req.body.text, new habitat.User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

export const EnvironmentsSlackAPI: Router = router;