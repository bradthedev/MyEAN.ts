import * as express from 'express';
import { Config } from '../interfaces/index.interface';

let config: Config = require('../server.config.json');

export class BaseRoute{
    router: express.Router
    constructor(){
        this.router = express.Router();

        this.router.get('/', (request, response) => {
            response.sendFile(config.pageMaintenance, {root: './'});            
        });

        this.router.get('/about', (request, response) => {
            response.sendFile(config.pageMaintenance, {root: './'});   
        });

        this.router.get('/contact', (request, response) =>{
            response.sendFile(config.pageMaintenance, {root: './'});   
        });
    }
}