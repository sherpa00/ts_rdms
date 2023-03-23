import express, {Request,Response,Application, NextFunction} from "express";
import morgan from "morgan";
import StatusCode from "http-status-codes";
import logger from "./configs/Logger";

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

export default app;