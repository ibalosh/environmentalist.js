import Axios, {AxiosPromise} from "axios";

export enum APIRequestType {
    GET = "get",
    POST = "post"
}

/**
 * Wrapper to simplify API requests execution.
 */
export class ApiRequest {
    protected apiUrl: string;
    protected headers: any;

    public constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    /**
     * API request execution with handled promises.
     *
     * @param {APIRequestType} type - type of request
     * @param {string} endpoint - API endpoint to reach out to
     * @param data - data sent by API request
     * @returns {Promise<T>} - response
     */
    protected processRequest<T>(type: APIRequestType, endpoint: string, data: any = null): Promise<T> {
        return this.axiosRequest(type, endpoint, data)
            .then(response => {
                return <T> response.data;
            })
            .catch(error => {
                throw new Error(error.message);
            });
    }

    /**
     * Bare API request by library used for their execution.
     *
     * @param {APIRequestType} type - type of request
     * @param {string} endpoint - API endpoint to reach out to
     * @param data - data sent by API request
     * @returns {AxiosPromise<T>} - response
     */
    private axiosRequest<T>(type: APIRequestType, endpoint: string, data: any = null): AxiosPromise<T> {
        return Axios.request(
            {
                method: type,
                headers: this.headers,
                url: `${this.apiUrl}/${endpoint}`,
                data: data}
        );
    };
}