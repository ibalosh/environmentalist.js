import {ApiRequest, APIRequestType} from "./ApiRequest";

/**
 * Slack endpoints to be used by Slack wrapper.
 */
enum SlackEndpoints {
    userList = 'api/users.list',
    userByEmail = 'api/users.lookupByEmail',
}

/**
 * Represents API requests wrapper for Slack.
 */
export class Slack extends ApiRequest {
    public constructor(url: string, authHeader: string) {
        super(url);

        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        };
    };

    /**
     * Find all user details.
     *
     * @param {string} emailAddress - address to search by user
     * @returns {Promise<T>} - promise response
     */
    public findUserByEmail<T>(emailAddress: string): Promise<T> {
        return this.processRequest(APIRequestType.GET, `${SlackEndpoints.userByEmail}?email=${emailAddress}`);
    };
}