import * as express from 'express';
import * as bodyParser from "body-parser"

import {EnvironmentsAPI, EnvironmentsSlackAPI} from './controllers';
import {setExpressBasicAuth} from "./auth";

/**
 * Connect routes and settings to the server.
 */
export class Server {
    public app: express.Application;

    public constructor(authentication: boolean, username?: string, password?: string) {
        this.app = express();

        if (authentication && username !== undefined && password !== undefined) {
            setExpressBasicAuth(this.app, username, password);
        }

        this.connectRoutes();
    }

    private connectRoutes() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.use('/', EnvironmentsAPI);
        this.app.use('/slack/', EnvironmentsSlackAPI);
    }

}







