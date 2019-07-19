import * as express from 'express';
import * as bodyParser from 'body-parser';
import { AccountRoute, BaseRoute } from './routes/index.routes';
import { Config } from './interfaces/index.interface';

let config: Config = require('./server.config.json');

const app = express();
const accountRoute = new AccountRoute(),
  baseRoute = new BaseRoute();

expressConfig();

function expressConfig() {
  app.use(loggerMiddleware);

  //build other config here
  app.use(bodyParser.json());

  //build routes here
  app.use('/', baseRoute.router)
  app.use('/api/v1/account', accountRoute.router);

  app.listen(config.port, function () {
    console.log('Example app listening at http://localhost:%s', config.port);
  });
}

function loggerMiddleware(request: express.Request, response: express.Response, next) {
  console.log(`${getTimestamp()} || ${request.method} ${request.path}`);
  next();
}

function getTimestamp() {
  var date = new Date();
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
}
