import * as mongoose from 'mongoose';
import {Account} from '../interfaces/index.interface';

const accountSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
});

const AccountModel = mongoose.model<Account & mongoose.Document>('Account', accountSchema);

export { AccountModel }
