import Logsene from 'winston-logsene';
import { createLogger, transports } from 'winston';
import { LOG } from '../config'

const allTransports = [
    new transports.Console()
];
if (LOG.SEMATEXT_TOKEN) {
    allTransports.push(
        new Logsene({
            token: LOG.SEMATEXT_TOKEN,
            url: LOG.SEMATEXT_URL
        })
    );
}

const logger = createLogger({
    transports: allTransports
});

export { logger };
