const KAFKA = {
    BROKER_URL: process.env.KAFKA_BROKER_URL || "localhost:9092",
    ACTION_TOPIC: process.env.ACTION_TOPIC || 'action'
};

const API_URL = process.env.API_URL || 'localhost:3000';

export { KAFKA, API_URL };
