import {Router, Response, Request} from 'express';
import * as Environmentalist from "../../index";
import {Slack} from "../../index";

const router: Router = Router();
const environmentManager: Environmentalist.Manager = new Environmentalist.Manager(new Environmentalist.ApiResponse());

/**
 * Environments status route.
 */
router.post('/status', function (req: Request, res: Response) {
    let response: Environmentalist.Response = environmentManager.environmentStatus();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

/**
 * Free environment route.
 */
router.post('/free', function (req: Request, res: Response) {
    let response: Environmentalist.Response = environmentManager.freeEnvironment(
        req.body.text, new Environmentalist.User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

/**
 * Take environment route.
 */
router.post('/take', function (req: Request, res: Response) {
    const slack: Slack = new Slack(Environmentalist.App.config.slackUrl, Environmentalist.App.config.slackAuthHeader);
    slack.findUserByEmail(req.body.user_email).then( (slackResponse: any) => {
        req.body.user_id = slackResponse.user.id;
        req.body.user_name = slackResponse.user.name;

        let response: Environmentalist.Response = environmentManager.takeEnvironmentByMessage(
            req.body.text, new Environmentalist.User(req.body.user_name, req.body.user_id));

        res.setHeader('Content-Type', 'application/json');
        res.status(response.statusCode).send(response.message);
    }).catch((error: Error) => {
        console.log(error.message);
    });
});

export const EnvironmentsAPI: Router = router;