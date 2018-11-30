import * as express from 'express';
import * as bodyParser from "body-parser"

import {EnvironmentsAPI, EnvironmentsSlackAPI} from './controllers';
import {Manager} from "../handler";

const app: express.Application = express();

/**
 * Set all environments to their initial state.
 */
const config = require("./../../config.json");
Manager.initEnvironments(config.environmentNames);

/**
 * Connect routes and settings to the server.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', EnvironmentsAPI);
app.use('/slack/', EnvironmentsSlackAPI);

export const HabitatServer: express.Application = app;







