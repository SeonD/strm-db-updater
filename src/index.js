import EventEmitter from 'events';
import { Consumer, KafkaClient, Admin } from 'kafka-node';
import mongoose from 'mongoose';
import { mergeObjects } from 'json-merger';

import { KAFKA, MONGO_URI } from './config';
import { getDocById, updateDoc } from './database';
import { logger } from './utils/logger';

logger.info(`DB UPDATER: Connecting to Kafka at ${KAFKA.BROKER_URL}`);

const kafkaClient = new KafkaClient({kafkaHost: KAFKA.BROKER_URL});
const admin = new Admin(kafkaClient);

const topics = {};
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
    const consumer = new Consumer(kafkaClient, [
        { topic, partition: 0 }
    ], { autoCommit: false });
    consumer.on('message', async (message) => {
        const { action, revisionNumber, docId } = parseAction(message.value);
        
        const doc = await getDocById(docId);
        logger.info('Doc found: ', doc.document);

        if (doc.revisionNumber != revisionNumber - 1) {
            logger.info(`Revision Number Mismatch: Current (${doc.revisionNumber}), Action (${revisionNumber})`);
            return;
        }
        
        doc.document = mergeObjects([doc.document, action]);
        logger.info('Action applied: ', doc.document);

        await updateDoc(doc);
        logger.info('Doc updated');
    });
});

function parseAction(rawMessage) {
    const obj = JSON.parse(rawMessage);
    return {
        action: obj.action,
        revisionNumber: obj.revisionNumber,
        docId: obj.docId
    };
}
