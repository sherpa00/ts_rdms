import express, { IRouter } from "express";
import * as UserController from "../controllers/user.controller";

const router: IRouter = express.Router();

router.post("/register", UserController.registerUser);

router.post("/login", UserController.loginUser);

export { router as UserRouter };
