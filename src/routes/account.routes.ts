import * as express from 'express';

export class AccountRoute{
    router: express.Router
    constructor(){
        this.router = express.Router();

        this.router.post('/register', (request, response) => {
            response.send('Not Implemented');
        });

        this.router.post('/login', (request, response) => {
            response.send('Not Implemented');
        });
    }
}