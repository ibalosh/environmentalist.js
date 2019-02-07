import {Router, Response, Request} from 'express';
import * as Environmentalist from "../../handler";

const router: Router = Router();
const environmentManager: Environmentalist.Manager = new Environmentalist.Manager(new Environmentalist.SlackResponse());

router.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('User-Agent', 'Environmentalist');
    next();
});

/**
 * Environments status route.
 */
router.post('/status', function (req: Request, res: Response) {
    let response: Environmentalist.Response = environmentManager.environmentStatus();
    res.status(response.statusCode).send(response.message);
});

/**
 * Free environment route.
 */
router.post('/free', function (req: Request, res: Response) {
    let response: Environmentalist.Response = environmentManager.freeEnvironment(
        req.body.text, new Environmentalist.User(req.body.user_name, req.body.user_id));

    res.status(response.statusCode).send(response.message);
});

/**
 * Take environment route.
 */
router.post('/take', function (req: Request, res: Response) {
    let response: Environmentalist.Response = environmentManager.takeEnvironmentByMessage(
        req.body.text, new Environmentalist.User(req.body.user_name, req.body.user_id));

    res.status(response.statusCode).send(response.message);
});

export const EnvironmentsSlackAPI: Router = router;