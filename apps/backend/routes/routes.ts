import { Router, request, response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import authMiddleware from "../middleware/auth.middleware"
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import { validationMiddleware } from '../middleware/validation';

const authRoutes = Router()
const auth = new AuthController()
authRoutes.post("/login", validationMiddleware(AuthDto), auth.logIn);
authRoutes.post("/signup", auth.signup);
authRoutes.post("/upload",  auth.uploadImage)
authRoutes.get("/fetchImages", auth.fetchImages)

export default authRoutes;


