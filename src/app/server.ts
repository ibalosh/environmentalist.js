import * as express from 'express';
import * as bodyParser from "body-parser"
import {EnvironmentsAPI, EnvironmentsSlackAPI} from './controllers';
import {Manager} from "../handler";

const config = require("./../../config.json");
Manager.initEnvironments(config.environmentNames);

const app: express.Application = express();
const port: number = config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', EnvironmentsAPI);
app.use('/slack/', EnvironmentsSlackAPI);

app.listen(port, () => {
    console.log(`Habitat listening at http://localhost:${port}/`);
});





