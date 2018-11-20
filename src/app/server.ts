import * as express from 'express';
import * as bodyParser from "body-parser"
import {EnvironmentsAPI, EnvironmentsSlackAPI} from './controllers';
import {Manager} from "../handler";

const environmentNames = require("./../../environments.json");
Manager.initEnvironments(environmentNames);

const app: express.Application = express();
const port: number = 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', EnvironmentsAPI);
app.use('/slack/', EnvironmentsSlackAPI);

app.listen(port, () => {
    console.log(`Habitat listening at http://localhost:${port}/`);
});





