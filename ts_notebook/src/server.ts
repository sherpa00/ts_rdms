import * as dotenv from "dotenv";
import app from "./app";
import logger from "./configs/Logger";

dotenv.config();

const PORT : string | undefined = process.env.PORT;

// server starts here
(async () => {
    try {
        app.listen(PORT,() => {
            logger.info("Server started at port " + PORT);
        })
    } catch (err) {
        logger.error(err);
        logger.info("Error while starting server");
    }
})();