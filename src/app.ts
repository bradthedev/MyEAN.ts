import 'dotenv/config';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { Controller } from './interfaces/index.interface'
import * as cookieParser from 'cookie-parser';  

export default class App {

    public app: express.Application;
    constructor(controllers: Controller[]) {
        this.app = express();

        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.InitializeControllers(controllers);
    }

    public listen() {
        this.app.listen(1487, () => {
            console.log(`App listening on the port ${1487}`);
        });
    }

    private connectToTheDatabase() {
        mongoose.connect('mongodb://localhost:27017/mydb', {useNewUrlParser: true});
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private InitializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
}