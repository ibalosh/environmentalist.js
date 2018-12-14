import * as express from 'express';
import * as bodyParser from "body-parser"

import {EnvironmentsAPI, EnvironmentsSlackAPI} from './controllers';
const app: express.Application = express();

/**
 * Connect routes and settings to the server.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', EnvironmentsAPI);
app.use('/slack/', EnvironmentsSlackAPI);

export const Server: express.Application = app;







