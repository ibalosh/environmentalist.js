import {EnvironmentRequestError, SlackApi} from "../../index";
import {Request} from "express";

export default class RequestManager {
    slackApi: SlackApi;

    constructor(slackApi: SlackApi) {
        this.slackApi = slackApi;
    }

    public async transformRequest(req: Request) {
        await this.validateUserDetails(req);
    }

    private async validateUserDetails(req: Request) {
        const userEmail: string | undefined = this.retrieveUserEmail(req);
        const userId: string | undefined = this.retrieveUserId(req);

        if (userId === undefined && userEmail === undefined) {
            throw new EnvironmentRequestError("Request doesn't have user id or email address.")
        }
        else if (userId === undefined) {
            await this.updateRequestWithSlackUserDetails(req);
        }
    }

    private async updateRequestWithSlackUserDetails(req: Request) {
        const slackResponse:any = await this.findSlackUserByEmail(req.body.user_email);
        this.updateRequest(req, slackResponse.user.id, slackResponse.user.name);
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


