import {ApiRequest, APIRequestType} from "./ApiRequest";

const config = require("./../../config.json");

enum SlackEndPoints {
    USER_LIST = 'api/users.list',
    USER_BY_EMAIL = 'api/users.lookupByEmail',
}

export class Slack extends ApiRequest {
    public constructor() {
        super(config.slack.url);

        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': config.slack.auth_header
        };
    };

    public findUserByEmail<T>(emailAddress: string): Promise<T> {
        return this.processRequest(APIRequestType.GET, `${SlackEndPoints.USER_BY_EMAIL}?email=${emailAddress}`);
    };
}