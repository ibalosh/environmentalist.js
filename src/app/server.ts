import * as express from 'express';
import * as bodyParser from "body-parser"
import {EnvironmentController} from './controllers';

const app: express.Application = express();
const port: number = 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', EnvironmentController);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});





