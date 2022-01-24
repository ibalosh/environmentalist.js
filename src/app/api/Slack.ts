import {ApiRequest, APIRequestType} from "./ApiRequest";
import * as Environmentalist from "../index";

/**
 * Slack endpoints to be used by Slack wrapper.
 */
enum SlackApiEndpoints {
    userList = 'api/users.list',
    userByEmail = 'api/users.lookupByEmail',
    postMessage = 'api/chat.postMessage'
}

/**
 * Represents API requests wrapper for Slack.
 */
export class SlackApi extends ApiRequest {
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
        return this.processRequest(APIRequestType.GET, `${SlackApiEndpoints.userByEmail}?email=${emailAddress}`);
    };

    /**
     * Open chat with Slack user.
     *
     *
     * @param {string} userId - Slack Id of the user to chat with
     * @param {string} message - Slack message to send to user
     * @returns {Promise<T>} - promise response
     */
    public sendMessageToUser<T>(userId: string, message: string): Promise<T> {
        const data = { channel: userId, text: message };
        return this.processRequest(APIRequestType.POST, `${SlackApiEndpoints.postMessage}`, data);
    };
}
