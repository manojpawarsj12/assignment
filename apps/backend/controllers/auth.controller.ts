import { NextFunction, Request, Response } from "express";
import { AuthDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.service";
import { HttpException } from "../exception";
import { User } from "../interfaces/user";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { UploadedFile } from "express-fileupload";
export class AuthController {
  authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authData: AuthDto = req.body;
      console.log("signup body", authData, req.body);
      const createdUser = await this.authService.signup(authData);
      return res.json({
        success: true,
        message: "Signup Successfully done",
        data: createdUser,
      });
    } catch (error) {
      console.log("signp, err", error);
      next(error);
    }
  };
  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: AuthDto = req.body;
      console.log("login body", userData);
      const { token, findUser } = await this.authService.login(userData);

      //res.setHeader('Set-Cookie', [cookie]);
      return res.json({
        success: true,
        message: "Signup Successfully done",
        data: findUser,
        token: token,
      });
    } catch (error) {
      console.log("logIn, err", error);
      next(error);
    }
  };
  public uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file = req.files.image as UploadedFile;
      const dir = "public/images/original/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      if (fs.existsSync(dir + file.name)) {
        throw new HttpException(400, "File already exists");
      }

      const fileName = file.name.split(".")[0];

      await file.mv("public/images/original/" + file.name);
      console.log(file, file.name);
      const buffers = await this.authService.uploadedImage(file.data, fileName);
      return res.json({
        success: true,
        data: buffers,
      });
    } catch (error) {
      console.log("uploadImage error", error);
      next(error);
    }
  };
  public fetchImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const buffers = await this.authService.fetchImages();
      return res.json({
        success: true,
        data: buffers,
      });
    } catch (error) {
      console.log("fetch image error", error);
      next(error);
    }
  };
}
