import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../configs/Logger";
import * as UserService from "../services/user.service";

export const removeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get userid from auth req.user.userid
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { userid }: any = req.user;

    await UserService.DeleteUser(userid);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully Removed user: ${userid}`,
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const modifyUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get the userid and old username
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { userid, username }: any = req.user;

    // same username cannot be added or modified
    if (username === req.body.username) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Cannot modify same username as old username",
      });
    }

    await UserService.ChangeUsername(userid, req.body.username);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Succesfully modified new username: ${req.body.username}`,
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const modifyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get the userid
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { userid }: any = req.user;

    await UserService.ChangePassword(userid, req.body.password);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Succesfully modified new password: ${req.body.password}`,
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
