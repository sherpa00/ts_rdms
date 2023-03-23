import { Request,Response,NextFunction } from "express";
import * as UserService from "../services/user.service";
import logger from "../configs/Logger";
import { StatusCodes } from "http-status-codes";


// user registering controller
export const registerUser = async (req: Request,res: Response,next: NextFunction) => {
    try {
        await UserService.Register(req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Successfully Registered New User : ${req.body.username}`
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

// user login controller
export const loginUser = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const loginResult = await UserService.Login(req.body);

        // !login.success => user not found
        if (!loginResult?.success) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                ...loginResult
            });
        }

        // login.success => user found
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully Logged in",
            token: loginResult.token,
            data: loginResult.data
        });

    } catch (err) {
        logger.error(err);
        next(err);
    }
}