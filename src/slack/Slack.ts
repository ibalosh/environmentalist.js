import Axios, {AxiosPromise} from "axios";
const config = require("./../../config.json");

enum SlackEndPoints {
    USER_LIST = 'api/users.list',
    USER_BY_EMAIL = 'api/users.lookupByEmail',
}

enum APIRequestType {
    GET = 'get',
    POST = 'post'
}

export class Slack {
    private headers: any;
    private apiUrl: string;

    public constructor() {
        this.apiUrl = config.slack.url;

        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': config.slack.auth_header
        };
    }

    public findUserByEmail<T>(emailAddress: string): Promise<T> {
        return this.processRequest(APIRequestType.GET, `${SlackEndPoints.USER_BY_EMAIL}?email=${emailAddress}`);
    }

    private processRequest<T>(type: APIRequestType, endpoint: string, data: any = null): Promise<T> {
        return this.axiosRequest(type, endpoint, data)
            .then(response => {
                return <T> response.data;
            })
            .catch(error => {
                throw new Error(error.message);
            });
    }

    private axiosRequest<T>(type: APIRequestType, endpoint: string, data: any = null): AxiosPromise<T> {
        return Axios.request(
            {
                method: type,
                headers: this.headers,
                url: `${this.apiUrl}/${endpoint}`,
                data: data}
            );
    };
};