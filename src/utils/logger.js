import Logsene from 'winston-logsene';
import { createLogger, transports, format } from 'winston';
import { LOG } from '../config';

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
    format: format.json,
    defaultMeta: { service: 'db-updater' },
    transports: allTransports
});

export { logger };
