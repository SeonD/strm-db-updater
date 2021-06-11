import EventEmitter from 'events';
import mongoose from 'mongoose';

import { MONGO_URI } from './config';
import { getAdmin, getConsumer, handleMessage } from './kafka';
import { logger } from './utils/logger';

const admin = getAdmin();

const topics = {};
const consumers = {};
const e = new EventEmitter();

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info('Connected to MongoDB');
    
    setInterval(() => {
        admin.listTopics((err, [_, { metadata }]) => {
            Object.keys(metadata).forEach((topic) => {
                if (!topics[topic]) {
                    topics[topic] = true;
                    e.emit('topic', topic);
                }
            });
        });
    }, 1000);
});

e.on('topic', (topic) => {
    const consumer = getConsumer(topic);
    consumer.on('message', handleMessage);
    consumers[topic] = consumer;
});
