import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '../exception';
import { DataStoredInToken, RequestWithUser } from "../interfaces/auth";
import userModel from '../models/auth.model';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    console.log("auth middleware invoked")
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = process.env.SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        console.log("user=>", findUser)
        req.user = findUser;
        console.log("auth middleware completed")
        next();
      } else {
        console.error("Wrong authentication token")
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      console.error("Authentication token missing")
      next(new HttpException(404, 'Authentication token missing'));
    }

  } catch (error) {
    console.error("Wrong authentication token")
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
