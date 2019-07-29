import * as mongoose from 'mongoose';
import App from './app';
import {AccountsController} from './controllers/index.controller';

const app = new App([
  new AccountsController(),
]);

app.listen();