import * as express from 'express';
import { Config } from '../interfaces/index.interface';

let config: Config = require('../server.config.json');

export class BaseRoute{
    router: express.Router
    constructor(){
        this.router = express.Router();

        this.router.get ('/*', function (req, res, next){
            if (req.headers.host.match(/^www/) == null) {
                res.redirect('https://www.' + req.headers.host + req.url);
            } else {
                next();
            }
        });

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