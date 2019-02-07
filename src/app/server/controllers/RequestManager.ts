import {EnvironmentRequestError, Slack} from "../../index";
import {Request} from "express";

export default class RequestManager {
    slackApi: Slack;

    constructor(slackApi: Slack) {
        this.slackApi = slackApi;
    }

    public async validateRequest(req: Request) {
        await this.validateUserDetails(req);
    }

    private async validateUserDetails(req: Request) {
        const userEmail: string | undefined = this.retrieveUserEmail(req);
        const userId: string | undefined = this.retrieveUserId(req);

        if (userId === undefined && userEmail === undefined) {
            throw new EnvironmentRequestError("Request' doesn't have user id or email address.")
        }
        else if (userId === undefined) {
            const slackResponse:any = await this.findSlackUserByEmail(req.body.user_email);
            this.updateRequest(req, slackResponse.user.id, slackResponse.user.name);
        }
    }

    private retrieveUserEmail(req: Request): string {
        return req.body.user_email
    }

    private retrieveUserId(req: Request): string {
        return req.body.user_id
    }

    private async findSlackUserByEmail(emailAddress: string) {
        return await this.slackApi.findUserByEmail(emailAddress);
    }

    private updateRequest(req: Request, userId: string, userName: string): void {
        req.body.user_id = userId;
        req.body.user_name = userName;
    }
}


