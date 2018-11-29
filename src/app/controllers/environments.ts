import {Router} from 'express';
import {Response, ApiResponse, Manager, User} from "../../handler";

const router: Router = Router();
const environmentManager: Manager = new Manager(new ApiResponse());

/**
 * Environments status route.
 */
router.post('/status', function (req: any, res: any) {
    let response: Response = environmentManager.environmentStatus();

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

/**
 * Free environment route.
 */
router.post('/free', function (req: any, res: any) {
    let response: Response = environmentManager.freeEnvironment(
        req.body.text, new User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

/**
 * Take environment route.
 */
router.post('/take', function (req, res) {
    let response: Response = environmentManager.takeEnvironmentByMessage(
        req.body.text, new User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

export const EnvironmentsAPI: Router = router;