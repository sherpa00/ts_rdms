import {createLogger, format, transports } from "winston";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const {File, Console } = transports;

const logger = createLogger({
    level: 'info'
});

const errorStackFormat = format((info) => {
    if (info.stack) {
        // tslint:disbale-next-line:no-console
        console.log(info.stack);
        return false;
    }

    return info;
});

const consoleTransport = new Console({
    format: format.combine(
        format.colorize(),
        format.simple(),
        errorStackFormat(),
    ),
});

logger.add(consoleTransport);

export default logger;