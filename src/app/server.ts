import * as express from 'express';
import * as bodyParser from "body-parser"
import {Manager} from "../handler";
import {EnvironmentsAPI, EnvironmentsSlackAPI} from './controllers';

const config = require("./../../config.json");
Manager.initEnvironments(config.environmentNames);

const app: express.Application = express();
const port: number = config.port;
const host: string = config.host;

/**
 * Connect routes and settings to the server.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', EnvironmentsAPI);
app.use('/slack/', EnvironmentsSlackAPI);

/**
 * Server initialization.
 */
app.listen(port, () => {
    console.log(`Habitat listening at ${host}:${port}/`);
});





