import express, {Request,Response,Application, NextFunction} from "express";
import morgan from "morgan";
import StatusCode from "http-status-codes";
import logger from "./configs/Logger";
import { UserRouter } from "./routes/user.route";
import passport from "./configs/passport.config";

const app : Application = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// express api error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error,req: Request,res: Response,next: NextFunction): Response => {
    logger.error(err.message,err);
    return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        error: err.message
    });
});

app.get("/",(req: Request,res: Response) : void => {
    res.status(200).json({
        success: true,
        message: "Server api alive"
    })
});

// test route to check auth
app.get("/private",passport.authenticate('jwt',{session: false}),(req: Request,res: Response) => {
    res.status(StatusCode.OK).json({
        success: true,
        message: "Auth is good",
        user: req.user
    });
})

app.use("/",UserRouter);

export default app;