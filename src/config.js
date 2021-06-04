const KAFKA = {
    BROKER_URL: process.env.KAFKA_BROKER_URL || "localhost:9092",
    ACTION_TOPIC: process.env.ACTION_TOPIC || 'action'
};

const API_URL = process.env.API_URL || 'localhost:3000';

const LOG = {
    SEMATEXT_URL: process.env.SEMATEXT_URL || 'https://logsene-receiver.sematext.com/_bulk',
    SEMATEXT_TOKEN: process.env.SEMATEXT_TOKEN
};

const MONGO_CONNECT = {
    scheme: process.env.MONGO_SCHEME || 'mongodb',
    user: process.env.MONGO_USER || 'root',
    password: process.env.MONGO_PASSWORD || 'pass',
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT ? `:${process.env.MONGO_PORT}` : '',
    database: process.env.MONGO_DATABASE || 'strm',
};
const MONGO_URI = `${MONGO_CONNECT.scheme}://${MONGO_CONNECT.user}:${MONGO_CONNECT.password}@${MONGO_CONNECT.host}${MONGO_CONNECT.port}/${MONGO_CONNECT.database}?authSource=admin`;

export { KAFKA, API_URL, LOG, MONGO_URI };
