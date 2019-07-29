import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestWithUser, DataStoredInToken } from '../interfaces/index.interface';
import {AccountModel} from '../models/index.model';
 
export default async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = "ABCD1234";
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await AccountModel.findById(id);
      if (user) {
        request.account = user;
        next();
      } else {
        next(response.status(401).send("Authentication Token Invalid"));
      }
    } catch (error) {
        next(response.status(401).send("Authentication Token Invalid"));
    }
  } else {
    next(response.status(401).send("You do not have permission to do that"));
  }
}