import Axios, {AxiosPromise} from "axios";

export enum APIRequestType {
    GET = 'get',
    POST = 'post'
}

export class ApiRequest {
    protected apiUrl: string;
    protected headers: any;

    public constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    protected processRequest<T>(type: APIRequestType, endpoint: string, data: any = null): Promise<T> {
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
}