import * as express from 'express';
import * as mongoose from 'mongoose';
import * as enums from '../enum/index'
import { Account, Controller, TokenData, DataStoredInToken } from '../interfaces/index.interface'
import { AccountModel } from '../models/index.model';
import * as assert from 'assert';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import authMiddleware from '../middleware/auth.middleware';

const bcrypt = require('bcrypt');
const saltRounds = 10;
const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


export class AccountsController implements Controller {
    public path = '/account'
    public router = express.Router();

    constructor() {
        this.initalizeRoutes()
    }

    public initalizeRoutes() {
        this.router.post(`${this.path}/register`, authMiddleware, this.createAccount)
        this.router.post(`${this.path}/login`, this.login)
    }

    createAccount = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const accountData: Account = request.body;
        const accountModel = new AccountModel(accountData);
        //Check to see if account can be found by username, if so this username isn't unique
        this.getAccountByUsername(accountModel.username, function (account) {
            try {
                //Validate username is available in model
                assert.ok(accountModel.username, 'Username must be included in request');
                //Validate password is available in model
                assert.ok(accountModel.password, 'Password must be included in request');
                //Validate that chosen username is not already used
                assert.ok(!account, 'Username is alerady taken');
                //Validate that chosen password meets security requirement from mediumRegex
                assert.ok(mediumRegex.test(accountModel.password), 'Password does not meet security requirement');

                //Hash password given once validation is complete and save
                bcrypt.hash(accountModel.password, saltRounds, function (err, hash) {
                    accountModel.password = hash;
                    accountModel.save(function (error, account) {
                        response.status(200).send({
                            result: enums.DataStatus.New
                        });
                    });
                });

            } catch (e) {

                if (e instanceof assert.AssertionError) {
                    console.log(`Validation Error:`, e.message)
                    response.status(401).send({
                        status: enums.DataStatus.ValidationFailed,
                        error: e.message
                    });
                } else {
                    console.log(`UNEXPECTED ERROR:`, e.message)
                    response.status(500).send({
                        status: enums.DataStatus.UnexpectedError,
                        error: e.message
                    });
                }
            }
        });
    }

    login = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const accountData: Account = request.body;
        const accountModel = new AccountModel(accountData);
        //Check to see if username exists in db and get model for that
        this.getAccountByUsername(accountModel.username, function (account) {
            console.log(account);
            try {
                assert.ok(account, 'No account found with that username');
                bcrypt.compare(accountModel.password, account.password, function (err, res) {
                    assert.ok(res, 'Incorrect Password');
                    account.password = undefined;
                    const tokenData = AccountsController.createToken(account);
                    response.setHeader('Set-Cookie', [AccountsController.createCookie(tokenData)]);
                    response.send(account);
                });
            } catch (e) {
                if (e instanceof assert.AssertionError) {
                    console.log(`Validation Error:`, e.message)
                    response.status(401).send({
                        status: enums.DataStatus.ValidationFailed,
                        error: e.message
                    });
                } else {
                    console.log(`UNEXPECTED ERROR:`, e.message)
                    response.status(500).send({
                        status: enums.DataStatus.UnexpectedError,
                        error: e.message
                    });
                }
            }

        });
    }

    private static createToken(account): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = "ABCD1234";
        const dataStoredInToken: DataStoredInToken = {
            _id: account._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }

    private static createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }

    private getAccountByUsername = (username: String, _callback: Function) => {
        AccountModel.findOne({ username: username }, function (err, account) {

            _callback(account);

        });
    }
}