import express, { IRouter } from "express";
import * as SettingsController from "../controllers/settings.controller";

const router: IRouter = express.Router();

router.patch("/user/modify/username", SettingsController.modifyUsername);
router.patch("/user/modify/password", SettingsController.modifyPassword);
router.delete("/user/remove", SettingsController.removeUser);

export { router as SettingsRouter };
