import userModel from "../models/auth.model"
import { AuthDto } from "../dtos/auth.dto"
import { hash, compare } from 'bcrypt';
import { User } from "../interfaces/user"
import { sign } from 'jsonwebtoken';
import sharp from "sharp"
import { DataStoredInToken, TokenData } from "../interfaces/auth";
import { HttpException } from "../exception";
import fs from "fs"
const fss = fs.promises
export class AuthService {
    public async signup(userData: AuthDto) {
        const findUser: User = await userModel.findOne({ email: userData.email });
        if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
        const hashedPassword = await hash(userData.password, 10);
        const createdUser = await userModel.create({ email: userData.email, password: hashedPassword })
        return createdUser;
    }
    public async login(userData: AuthDto) {
        const findUser: User = await userModel.findOne({ email: userData.email });
        if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

        const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
        if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

        const tokenData = this.createToken(findUser);
        const cookie = this.createCookie(tokenData);
        const token = tokenData.token
        return { token, findUser };
    }
    public createToken(user: User): TokenData {
        const dataStoredInToken: DataStoredInToken = { _id: user._id };
        const secretKey: string = process.env.SECRET_KEY;
        const expiresIn: number = 60 * 60;

        return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
    }

    public createCookie(tokenData: TokenData): string {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }
    public async uploadedImage(file: Buffer, fileName: string) {
        const allPossibleResolutions = {
            "360p": [480, 360],
            "480p": [640, 480],
            "720p": [1280, 720],
            "1080p": [1920, 1080],
            "240p": [352, 240],
            "144p": [192, 144],
        }
        const resolutions = Object.keys(allPossibleResolutions)
        const fileNames = []
        fs.mkdirSync("public/images/" + fileName)
        await Promise.all(resolutions.map(resolution => {
            const resFileName = `public/images/${fileName}/${fileName}-${resolution}.jpeg`;
            fileNames.push(resFileName)
            return sharp(file).resize(allPossibleResolutions[resolution][0], allPossibleResolutions[resolution][1], { fit: sharp.fit.contain }).jpeg({ quality: 80 }).toFile(resFileName)
        }))
        //.toFile("./" + fileName + "/" + fileName + "144p" + ".jpeg")
        // const result144p = await sharp(file).resize(allPossibleResolutions["144p"][0], allPossibleResolutions["144p"][1], { fit: sharp.fit.contain }).jpeg({ quality: 80 }).toFile("public/images/" + fileName + "/" + fileName + "144p" + ".jpeg")
        // const result240p = await sharp(file).resize(allPossibleResolutions["240p"][0], allPossibleResolutions["240p"][1], { fit: sharp.fit.contain }).jpeg({ quality: 80 }).toFile("public/images/" + fileName + "/" + fileName + "240p" + ".jpeg")
        // const result360p = await sharp(file).resize(allPossibleResolutions["360p"][0], allPossibleResolutions["360p"][1], { fit: sharp.fit.contain }).jpeg({ quality: 80 }).toFile("public/images/" + fileName + "/" + fileName + "320p" + ".jpeg")
        // const result480p = await sharp(file).resize(allPossibleResolutions["480p"][0], allPossibleResolutions["480p"][1], { fit: sharp.fit.contain }).jpeg({ quality: 80 }).toFile("public/images/" + fileName + "/" + fileName + "480p" + ".jpeg")
        // const result1080p = await sharp(file).resize(allPossibleResolutions["1080p"][0], allPossibleResolutions["1080p"][1], { fit: sharp.fit.contain }).jpeg({ quality: 80 }).toFile("public/images/" + fileName + "/" + fileName + "720p" + ".jpeg")
        // const result720p = await sharp(file).resize(allPossibleResolutions["720p"][0], allPossibleResolutions["720p"][1], { fit: sharp.fit.contain }).jpeg({ quality: 80 }).toFile("public/images/" + fileName + "/" + fileName + "1080p" + ".jpeg")
        // return ["public/images/" + fileName + "/" + fileName + "144p" + ".jpeg"",]
        return fileNames.map(fileName => fileName.replace('public/images/', ''));
    }
    public async fetchImages() {
        const buffers = []
        const files = await fss.readdir("public/images/original/")
        for (let each of files) {
            buffers.push("original/" + each)
        }
        return buffers
    }

}